'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Save, LogOut, Loader2, ArrowLeft, Image as ImageIcon, Code, Type, Quote, Heading, Pencil, Eye, Link } from 'lucide-react';
import { slugify } from '@/utils/slugify';

type BlockType = 'heading' | 'paragraph' | 'image' | 'code' | 'quote' | 'link';

interface Block {
    id: string;
    type: BlockType;
    value: string;
    language?: string; // for code blocks
    url?: string;      // for link blocks
}

interface Blog {
    id?: string;
    title: string;
    slug: string;
    excerpt: string;
    content: Block[];
    cover_image: string;
    published: boolean;
    tags: string[];
    meta_title?: string;
    meta_description?: string;
    created_at?: string;
}

export default function AdminBlogPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState<Blog>({
        title: '',
        slug: '',
        excerpt: '',
        content: [],
        cover_image: '',
        published: false,
        tags: [],
        meta_title: '',
        meta_description: ''
    });

    const router = useRouter();

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('blogs')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setBlogs(data);
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    // --- Block CMS Logic ---
    const addBlock = (type: BlockType) => {
        const newBlock: Block = {
            id: crypto.randomUUID(),
            type,
            value: '',
            ...(type === 'code' ? { language: 'javascript' } : {})
        };
        setFormData(prev => ({
            ...prev,
            content: [...prev.content, newBlock]
        }));
    };

    const updateBlock = (id: string, value: string, language?: string, url?: string) => {
        setFormData(prev => ({
            ...prev,
            content: prev.content.map(block =>
                block.id === id
                    ? { ...block, value, ...(language !== undefined ? { language } : {}), ...(url !== undefined ? { url } : {}) }
                    : block
            )
        }));
    };

    const removeBlock = (id: string) => {
        setFormData(prev => ({
            ...prev,
            content: prev.content.filter(block => block.id !== id)
        }));
    };

    const moveBlock = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === formData.content.length - 1) return;

        const newContent = [...formData.content];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;

        [newContent[index], newContent[swapIndex]] = [newContent[swapIndex], newContent[index]];

        setFormData(prev => ({ ...prev, content: newContent }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, blockId?: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;

            if (blockId) {
                // Updating an image block
                updateBlock(blockId, base64String);
            } else {
                // Updating cover image
                setFormData(prev => ({ ...prev, cover_image: base64String }));
            }
        };
        reader.readAsDataURL(file);
    };

    // --- Form Actions ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const blogData = {
            ...formData,
            slug: formData.slug || slugify(formData.title),
        };

        const { id, ...dataToSave } = blogData;

        let error;

        if (id) {
            const { error: updateError } = await supabase
                .from('blogs')
                .update(dataToSave)
                .eq('id', id);
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from('blogs')
                .insert([dataToSave]);
            error = insertError;
        }

        if (!error) {
            setShowForm(false);
            resetForm();
            fetchBlogs();
        } else {
            alert(error.message);
        }
        setSaving(false);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            slug: '',
            excerpt: '',
            content: [],
            cover_image: '',
            published: false,
            tags: [],
            meta_title: '',
            meta_description: '',
        });
    };

    const deleteBlog = async (id: string) => {
        if (!confirm('Are you sure you want to delete this blog?')) return;
        const { error } = await supabase.from('blogs').delete().eq('id', id);
        if (!error) fetchBlogs();
    };

    const handleKeyDownTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const value = e.currentTarget.value.trim();
            if (value && !formData.tags?.includes(value)) {
                setFormData(prev => ({
                    ...prev,
                    tags: [...(prev.tags || []), value]
                }));
            }
            e.currentTarget.value = '';
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-600/30">
            {/* Header */}
            <nav className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push('/admin')}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors mr-2"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-400 hover:text-white" />
                        </button>
                        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center font-bold text-xl shadow-[0_0_20px_rgba(220,38,38,0.3)]">
                            M
                        </div>
                        <div>
                            <h1 className="font-bold tracking-tight text-lg">Blog CMS</h1>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">Advanced Block Builder</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/admin/blog/topics')}
                            className="bg-[#111] hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2"
                        >
                            Manage Topics
                        </button>
                        <button
                            onClick={() => {
                                if (showForm) {
                                    setShowForm(false);
                                    resetForm();
                                } else setShowForm(true);
                            }}
                            className="bg-white text-black hover:bg-white/90 px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2"
                        >
                            <Plus className={`w-4 h-4 transition-transform duration-300 ${showForm ? 'rotate-45' : ''}`} />
                            {showForm ? 'Cancel' : 'New Blog'}
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

            <main className="max-w-5xl mx-auto px-6 py-12">

                {/* FORM VIEW */}
                {showForm ? (
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-8 border-b border-white/5 bg-gradient-to-r from-red-600/10 to-transparent flex justify-between items-center">
                            <h2 className="text-2xl font-bold font-serif">{formData.id ? 'Edit Post' : 'Draft New Post'}</h2>
                            <button
                                onClick={handleSubmit}
                                disabled={saving}
                                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {saving ? 'Saving...' : 'Save Post'}
                            </button>
                        </div>

                        <div className="p-8 space-y-10">
                            {/* Basics Settings */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Title</label>
                                    <input
                                        type="text"
                                        placeholder="Epic Blog Title..."
                                        className="w-full bg-transparent text-4xl font-serif font-bold focus:outline-none placeholder:text-gray-700 transition-colors border-b border-white/10 focus:border-red-600 pb-2"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Slug (URL)</label>
                                        <input
                                            type="text"
                                            placeholder="auto-generated-if-empty"
                                            className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-red-600 transition-colors"
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between bg-[#111] border border-white/5 rounded-xl px-4 py-3">
                                        <label className="text-sm font-bold text-gray-400">Published Status</label>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, published: !formData.published })}
                                            className={`w-14 h-8 rounded-full transition-colors relative ${formData.published ? 'bg-red-600' : 'bg-white/10'}`}
                                        >
                                            <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-transform ${formData.published ? 'left-7' : 'left-1'}`} />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Excerpt summary</label>
                                    <textarea
                                        placeholder="A short description for the blog card..."
                                        rows={2}
                                        className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-red-600 transition-colors resize-none"
                                        value={formData.excerpt}
                                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    />
                                </div>

                                {/* Tags Input */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Tags / Topics</label>
                                    <div className="bg-[#111] border border-white/5 rounded-xl p-3 focus-within:border-red-600 transition-colors">
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {formData.tags?.map((tag) => (
                                                <span key={tag} className="bg-white/10 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2">
                                                    {tag}
                                                    <button type="button" onClick={() => removeTag(tag)} className="text-gray-400 hover:text-red-500 focus:outline-none">
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Type a tag and press Enter... (e.g. Design, React)"
                                            className="w-full bg-transparent focus:outline-none text-sm px-2 py-1 placeholder:text-gray-600"
                                            onKeyDown={handleKeyDownTag}
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-500 mt-2">Press enter to add multiple tags.</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Cover Image (Base64)</label>
                                    <div className="bg-[#111] border border-white/10 rounded-xl p-4 flex flex-col items-center gap-4">
                                        {formData.cover_image ? (
                                            <div className="relative w-full aspect-video rounded-lg overflow-hidden group">
                                                <img src={formData.cover_image} alt="Cover" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                    <button onClick={() => setFormData({ ...formData, cover_image: '' })} className="bg-red-600 text-white p-2 rounded-full"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                        ) : (
                                            <label className="w-full py-12 border-2 border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-white/30 hover:bg-white/5 transition-colors">
                                                <ImageIcon className="w-8 h-8 text-gray-500" />
                                                <span className="text-gray-400 text-sm">Click to upload cover image</span>
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e)} />
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* SEO SECTION */}
                            <div className="pt-10 border-t border-white/10">
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                    <Eye className="w-5 h-5 text-red-600" /> Search Engine Optimization (SEO)
                                </h3>
                                <div className="grid grid-cols-1 gap-6 bg-[#111] border border-white/5 p-6 rounded-2xl">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Meta Title</label>
                                        <input
                                            type="text"
                                            placeholder="Custom title for Google (Optional)"
                                            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-red-600 transition-colors text-sm"
                                            value={formData.meta_title || ''}
                                            onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                                        />
                                        <p className="text-[10px] text-gray-600 mt-2 italic">Recommended: 50-60 characters. Falls back to blog title if empty.</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Meta Description</label>
                                        <textarea
                                            placeholder="Brief summary for search results (Optional)"
                                            rows={2}
                                            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-red-600 transition-colors text-sm resize-none"
                                            value={formData.meta_description || ''}
                                            onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                                        />
                                        <p className="text-[10px] text-gray-600 mt-2 italic">Recommended: 150-160 characters. Falls back to excerpt if empty.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Block Builder Area */}
                            <div className="border-t border-white/10 pt-10">
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                    Content Builder <span className="text-xs bg-red-600/20 text-red-500 px-2 py-1 rounded-full">{formData.content.length} Blocks</span>
                                </h3>

                                <div className="space-y-4 mb-8">
                                    {formData.content.map((block, index) => (
                                        <div key={block.id} className="group relative bg-[#111] border border-white/5 rounded-xl p-4 pl-12 hover:border-white/20 transition-colors">

                                            {/* Block Controls */}
                                            <div className="absolute left-2 top-0 bottom-0 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity w-8">
                                                <button type="button" onClick={() => moveBlock(index, 'up')} className="text-gray-500 hover:text-white p-1" disabled={index === 0}>↑</button>
                                                <div className="text-[10px] text-gray-600">{index + 1}</div>
                                                <button type="button" onClick={() => moveBlock(index, 'down')} className="text-gray-500 hover:text-white p-1" disabled={index === formData.content.length - 1}>↓</button>
                                            </div>

                                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                <button type="button" onClick={() => removeBlock(block.id)} className="text-gray-500 hover:text-red-500 bg-[#1a1a1a] p-1.5 rounded-md"><Trash2 className="w-4 h-4" /></button>
                                            </div>

                                            {/* Block Inputs based on type */}
                                            {block.type === 'heading' && (
                                                <input
                                                    type="text"
                                                    placeholder="Section Heading..."
                                                    className="w-full bg-transparent text-2xl font-serif text-white focus:outline-none"
                                                    value={block.value}
                                                    onChange={(e) => updateBlock(block.id, e.target.value)}
                                                />
                                            )}

                                            {block.type === 'paragraph' && (
                                                <textarea
                                                    placeholder="Write your paragraph..."
                                                    rows={4}
                                                    className="w-full bg-transparent text-gray-300 focus:outline-none resize-none"
                                                    value={block.value}
                                                    onChange={(e) => updateBlock(block.id, e.target.value)}
                                                />
                                            )}

                                            {block.type === 'quote' && (
                                                <div className="border-l-2 border-red-600 pl-4">
                                                    <textarea
                                                        placeholder="Inspiring quote..."
                                                        rows={2}
                                                        className="w-full bg-transparent text-white italic text-lg focus:outline-none resize-none"
                                                        value={block.value}
                                                        onChange={(e) => updateBlock(block.id, e.target.value)}
                                                    />
                                                </div>
                                            )}

                                            {block.type === 'code' && (
                                                <div className="border border-white/10 rounded-lg overflow-hidden">
                                                    <div className="bg-[#0a0a0a] px-3 py-2 border-b border-white/10">
                                                        <select
                                                            className="bg-transparent text-xs text-gray-400 outline-none cursor-pointer uppercase tracking-wider"
                                                            value={block.language || 'javascript'}
                                                            onChange={(e) => updateBlock(block.id, block.value, e.target.value)}
                                                        >
                                                            <option value="javascript">JavaScript</option>
                                                            <option value="typescript">TypeScript</option>
                                                            <option value="python">Python</option>
                                                            <option value="csharp">C#</option>
                                                            <option value="java">Java</option>
                                                            <option value="go">Go</option>
                                                            <option value="rust">Rust</option>
                                                            <option value="cpp">C++</option>
                                                            <option value="ruby">Ruby</option>
                                                            <option value="php">PHP</option>
                                                            <option value="html">HTML</option>
                                                            <option value="css">CSS</option>
                                                            <option value="json">JSON</option>
                                                            <option value="bash">Terminal</option>
                                                        </select>
                                                    </div>
                                                    <textarea
                                                        placeholder="Paste code here..."
                                                        rows={6}
                                                        className="w-full bg-[#0a0a0a] text-green-400 font-mono text-sm p-4 focus:outline-none resize-none"
                                                        value={block.value}
                                                        onChange={(e) => updateBlock(block.id, e.target.value)}
                                                    />
                                                </div>
                                            )}

                                            {block.type === 'image' && (
                                                <div>
                                                    {block.value ? (
                                                        <img src={block.value} className="max-h-64 rounded-lg border border-white/10" alt="Block image" />
                                                    ) : (
                                                        <label className="w-full py-8 border-2 border-dashed border-white/10 rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-white/5 transition-colors">
                                                            <ImageIcon className="w-5 h-5 text-gray-500" />
                                                            <span className="text-gray-400 text-sm">Select image (converts to base64)</span>
                                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, block.id)} />
                                                        </label>
                                                    )}
                                                </div>
                                            )}

                                            {block.type === 'link' && (
                                                <div className="space-y-3 border-l-2 border-blue-500 pl-4 py-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Link Text (e.g., Read More)"
                                                        className="w-full bg-transparent text-white font-bold text-lg focus:outline-none placeholder:text-gray-600"
                                                        value={block.value}
                                                        onChange={(e) => updateBlock(block.id, e.target.value)}
                                                    />
                                                    <input
                                                        type="url"
                                                        placeholder="URL (e.g., https://example.com/)"
                                                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-sm text-blue-400 focus:outline-none focus:border-red-600 transition-colors"
                                                        value={block.url || ''}
                                                        onChange={(e) => updateBlock(block.id, block.value, undefined, e.target.value)}
                                                    />
                                                </div>
                                            )}

                                        </div>
                                    ))}
                                </div>

                                {/* Add Block Controls */}
                                <div className="border border-white/10 rounded-xl p-2 flex flex-wrap gap-2 justify-center bg-white/5 backdrop-blur-sm sticky bottom-10 z-20">
                                    <button type="button" onClick={() => addBlock('heading')} className="flex items-center gap-2 px-3 py-2 bg-[#111] hover:bg-white/10 rounded-lg text-sm font-medium transition-colors">
                                        <Heading className="w-4 h-4 text-gray-400" /> Heading
                                    </button>
                                    <button type="button" onClick={() => addBlock('paragraph')} className="flex items-center gap-2 px-3 py-2 bg-[#111] hover:bg-white/10 rounded-lg text-sm font-medium transition-colors">
                                        <Type className="w-4 h-4 text-gray-400" /> Paragraph
                                    </button>
                                    <button type="button" onClick={() => addBlock('quote')} className="flex items-center gap-2 px-3 py-2 bg-[#111] hover:bg-white/10 rounded-lg text-sm font-medium transition-colors">
                                        <Quote className="w-4 h-4 text-gray-400" /> Quote
                                    </button>
                                    <button type="button" onClick={() => addBlock('code')} className="flex items-center gap-2 px-3 py-2 bg-[#111] hover:bg-white/10 rounded-lg text-sm font-medium transition-colors">
                                        <Code className="w-4 h-4 text-gray-400" /> Code Snippet
                                    </button>
                                    <button type="button" onClick={() => addBlock('link')} className="flex items-center gap-2 px-3 py-2 bg-[#111] hover:bg-white/10 rounded-lg text-sm font-medium transition-colors">
                                        <Link className="w-4 h-4 text-gray-400" /> Link
                                    </button>
                                    <button type="button" onClick={() => addBlock('image')} className="flex items-center gap-2 px-3 py-2 bg-[#111] hover:bg-white/10 rounded-lg text-sm font-medium transition-colors">
                                        <ImageIcon className="w-4 h-4 text-gray-400" /> Image
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* LIST VIEW */
                    <div className="space-y-4">
                        {loading ? (
                            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>
                        ) : blogs.length === 0 ? (
                            <div className="text-center py-20 bg-[#0a0a0a] rounded-2xl border border-white/5">
                                <p className="text-gray-500 mb-4">No blog posts yet.</p>
                                <button onClick={() => setShowForm(true)} className="text-red-500 font-bold hover:underline">Create your first post</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {blogs.map(blog => (
                                    <div key={blog.id} className="bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden group hover:border-white/30 transition-colors">
                                        {blog.cover_image && (
                                            <div className="w-full h-48 border-b border-white/5 relative overflow-hidden">
                                                <img src={blog.cover_image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Cover" />
                                            </div>
                                        )}
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="font-serif text-xl font-bold">{blog.title}</h3>
                                                <div className={`px-2 py-1 text-[10px] uppercase tracking-widest font-bold rounded ${blog.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                                    {blog.published ? 'Public' : 'Draft'}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-400 mb-6 line-clamp-2">{blog.excerpt}</p>

                                            <div className="flex gap-2">
                                                <button onClick={() => { setFormData(blog as Blog); setShowForm(true); }} className="flex-1 bg-white/5 hover:bg-white/10 text-white font-medium py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
                                                    <Pencil className="w-4 h-4" /> Edit
                                                </button>
                                                <button onClick={() => deleteBlog(blog.id!)} className="bg-red-500/10 hover:bg-red-500/20 text-red-500 p-2 rounded-lg transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
