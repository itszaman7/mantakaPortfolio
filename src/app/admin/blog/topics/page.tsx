'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Save, LogOut, ArrowLeft, Loader2, GripVertical, Pencil } from 'lucide-react';

interface BlogTopic {
    id: string;
    number: string;
    title: string;
    description: string;
    sort_order: number;
}

export default function AdminBlogTopicsPage() {
    const [topics, setTopics] = useState<BlogTopic[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const router = useRouter();

    useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('blog_topics')
            .select('*')
            .order('sort_order', { ascending: true });

        if (!error && data) {
            setTopics(data);
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const addTopic = () => {
        const newTopic: BlogTopic = {
            id: 'new-' + Date.now(),
            number: '0' + (topics.length + 1),
            title: '',
            description: '',
            sort_order: topics.length + 1
        };
        setTopics([...topics, newTopic]);
    };

    const updateTopic = (index: number, field: keyof BlogTopic, value: string) => {
        const newTopics = [...topics];
        newTopics[index] = { ...newTopics[index], [field]: value };
        setTopics(newTopics);
    };

    const removeTopic = async (index: number) => {
        const topicToRemove = topics[index];
        if (topicToRemove.id.startsWith('new-')) {
            setTopics(topics.filter((_, i) => i !== index));
        } else {
            if (!confirm('Are you sure you want to delete this topic?')) return;
            const { error } = await supabase.from('blog_topics').delete().eq('id', topicToRemove.id);
            if (!error) {
                setTopics(topics.filter((_, i) => i !== index));
            } else {
                alert(error.message);
            }
        }
    };

    const moveTopic = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === topics.length - 1) return;

        const newTopics = [...topics];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;

        [newTopics[index], newTopics[swapIndex]] = [newTopics[swapIndex], newTopics[index]];

        // Update sort_order explicitly
        newTopics.forEach((topic, idx) => {
            topic.sort_order = idx + 1;
        });

        setTopics(newTopics);
    };

    const saveAllTopics = async () => {
        setSaving(true);
        try {
            for (const topic of topics) {
                if (topic.id.startsWith('new-')) {
                    const { id, ...newTopicData } = topic;
                    await supabase.from('blog_topics').insert([newTopicData]);
                } else {
                    await supabase.from('blog_topics').update({
                        number: topic.number,
                        title: topic.title,
                        description: topic.description,
                        sort_order: topic.sort_order
                    }).eq('id', topic.id);
                }
            }
            alert('Topics saved successfully!');
            fetchTopics();
        } catch (error: any) {
            alert('Error saving topics: ' + error.message);
        }
        setSaving(false);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-600/30">
            {/* Header */}
            <nav className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push('/admin/blog')}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors mr-2"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-400 hover:text-white" />
                        </button>
                        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center font-bold text-xl shadow-[0_0_20px_rgba(220,38,38,0.3)]">
                            M
                        </div>
                        <div>
                            <h1 className="font-bold tracking-tight text-lg">Blog Topics</h1>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">Manage Research & Topics</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={saveAllTopics}
                            disabled={saving}
                            className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-white mb-2">Research & Topics</h2>
                        <p className="text-gray-400 text-sm font-sans">These topics appear on the main engineering blog page as categories.</p>
                    </div>
                    <button
                        onClick={addTopic}
                        className="bg-white/5 border border-white/10 text-white hover:bg-white/10 px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Topic
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>
                ) : (
                    <div className="space-y-4">
                        {topics.map((topic, index) => (
                            <div key={topic.id} className="group relative bg-[#111] border border-white/5 hover:border-white/20 rounded-xl p-6 transition-colors flex gap-6">

                                {/* Controls */}
                                <div className="flex flex-col items-center justify-center gap-2 text-gray-600">
                                    <button onClick={() => moveTopic(index, 'up')} disabled={index === 0} className="hover:text-white disabled:opacity-30">↑</button>
                                    <GripVertical className="w-4 h-4" />
                                    <button onClick={() => moveTopic(index, 'down')} disabled={index === topics.length - 1} className="hover:text-white disabled:opacity-30">↓</button>
                                </div>

                                {/* Form */}
                                <div className="flex-1 space-y-4">
                                    <div className="flex gap-4">
                                        <div className="w-24">
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Number</label>
                                            <input
                                                type="text"
                                                placeholder="01"
                                                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-red-500 font-mono text-sm focus:outline-none focus:border-red-600 transition-colors"
                                                value={topic.number}
                                                onChange={(e) => updateTopic(index, 'number', e.target.value)}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Title</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Core Architecture"
                                                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-white font-sans focus:outline-none focus:border-red-600 transition-colors"
                                                value={topic.title}
                                                onChange={(e) => updateTopic(index, 'title', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Description</label>
                                        <input
                                            type="text"
                                            placeholder="Scale, state management, and complex systems..."
                                            className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-gray-400 font-serif italic text-sm focus:outline-none focus:border-red-600 transition-colors"
                                            value={topic.description}
                                            onChange={(e) => updateTopic(index, 'description', e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Delete Action */}
                                <button onClick={() => removeTopic(index)} className="self-start text-gray-600 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}

                        {topics.length === 0 && (
                            <div className="text-center py-16 bg-[#0a0a0a] border border-white/5 rounded-2xl">
                                <p className="text-gray-500">No topics added yet.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
