'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { CldUploadWidget } from 'next-cloudinary';
import { Plus, Trash2, ExternalLink, Image as ImageIcon, Save, LogOut, Loader2, CheckCircle2, Pencil } from 'lucide-react';
import { slugify } from '@/utils/slugify';

interface Project {
    id?: string;
    slug?: string;
    title: string;
    category: string;
    subtitle?: string;
    src: string;
    description: string;
    tech_stack: string[];
    award_name?: string;
    award_link?: string;
    media: { type: 'image' | 'video'; url: string }[];
    link?: string;
    background_color?: string;
    story_challenge?: string;
    story_solution?: string;
    story_outcome?: string;
    code_link?: string;
    demo_link?: string;
}

interface HeroStat {
    id?: string;
    title: string;
    subtitle: string;
    highlight: string;
    suffix: string;
    description: string;
    image: string;
    sort_order: number;
}

interface Milestone {
    id?: string;
    year: string;
    title: string;
    description: string;
    images: string[];
    tags: string[];
    side: 'left' | 'right' | 'center';
    sort_order: number;
}

const COLOR_PRESETS = [
    { name: 'Spotify Green', value: '#1DB954' },
    { name: 'Spotify Light Green', value: '#1ED760' },
    { name: 'Spotify Dark Green', value: '#117a37' },

    { name: 'Spotify Black', value: '#191414' },
    { name: 'Dark Gray', value: '#282828' },
    { name: 'Light Gray', value: '#535353' },

    { name: 'Spotify White', value: '#FFFFFF' },
    { name: 'Off White', value: '#F5F5F5' },

    { name: 'Energetic Red', value: '#FF4632' },
    { name: 'Crimson', value: '#DC143C' },
    { name: 'Dark Red', value: '#8B0000' },

    { name: 'Upbeat Orange', value: '#FFA300' },
    { name: 'Coral', value: '#FF7F50' },
    { name: 'Burnt Orange', value: '#CC5500' },

    { name: 'Cheerful Yellow', value: '#FFD200' },
    { name: 'Gold', value: '#FFD700' },
    { name: 'Amber', value: '#FFBF00' },

    { name: 'Electric Blue', value: '#2E77D0' },
    { name: 'Deep Blue', value: '#003399' },
    { name: 'Sky Blue', value: '#87CEEB' },

    { name: 'Vibrant Purple', value: '#8C52FF' },
    { name: 'Indigo', value: '#4B0082' },
    { name: 'Lavender', value: '#B57EDC' },

    { name: 'Hot Pink', value: '#FF1493' },
    { name: 'Magenta', value: '#FF00FF' },
    { name: 'Teal', value: '#008080' },

    { name: 'Mellow Pastel', value: '#E8D5B5' },
    { name: 'Pastel Pink', value: '#FFB7B2' },
    { name: 'Pastel Blue', value: '#AEC6CF' },
    { name: 'Pastel Green', value: '#77DD77' },
];

type AdminTab = 'projects' | 'stats' | 'milestones';

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<AdminTab>('projects');
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<Project>({
        title: '',
        category: '',
        subtitle: '',
        src: '',
        description: '',
        tech_stack: [],
        award_name: '',
        award_link: '',
        media: [],
        link: '',
        background_color: '#1DB954',
        story_challenge: '',
        story_solution: '',
        story_outcome: '',
        code_link: '',
        demo_link: '',
    });
    const [stats, setStats] = useState<HeroStat[]>([]);
    const [statsLoading, setStatsLoading] = useState(false);
    const [showStatsForm, setShowStatsForm] = useState(false);
    const [statsFormData, setStatsFormData] = useState<HeroStat>({
        title: '',
        subtitle: '',
        highlight: '',
        suffix: '',
        description: '',
        image: '',
        sort_order: 0,
    });
    const [statsSaving, setStatsSaving] = useState(false);
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [milestonesLoading, setMilestonesLoading] = useState(false);
    const [showMilestoneForm, setShowMilestoneForm] = useState(false);
    const [milestoneFormData, setMilestoneFormData] = useState<Milestone>({
        year: '',
        title: '',
        description: '',
        images: [],
        tags: [],
        side: 'left',
        sort_order: 0,
    });
    const [milestonesSaving, setMilestonesSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (activeTab === 'stats') fetchHeroStats();
        if (activeTab === 'milestones') fetchMilestones();
    }, [activeTab]);

    const fetchProjects = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setProjects(data);
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const projectData = {
            ...formData,
            slug: formData.slug || slugify(formData.title),
        };

        const { id, ...dataToSave } = projectData; // Separate ID from data

        let error;

        if (id) {
            const { error: updateError } = await supabase
                .from('projects')
                .update(dataToSave)
                .eq('id', id);
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from('projects')
                .insert([dataToSave]);
            error = insertError;
        }

        if (!error) {
            setShowForm(false);
            resetForm();
            fetchProjects();
        } else {
            alert(error.message);
        }
        setSaving(false);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            category: '',
            subtitle: '',
            src: '',
            description: '',
            tech_stack: [],
            award_name: '',
            award_link: '',
            media: [],
            link: '',
            background_color: '#1DB954',
            story_challenge: '',
            story_solution: '',
            story_outcome: '',
            code_link: '',
            demo_link: '',
        });
    };

    const handleEdit = (project: Project) => {
        setFormData(project);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const deleteProject = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);

        if (!error) {
            fetchProjects();
        }
    };

    const fetchHeroStats = async () => {
        setStatsLoading(true);
        const { data, error } = await supabase
            .from('hero_stats')
            .select('*')
            .order('sort_order', { ascending: true });
        if (!error && data) setStats(data);
        setStatsLoading(false);
    };

    const handleStatsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatsSaving(true);
        const { id, ...rest } = statsFormData;
        if (id) {
            const { error } = await supabase.from('hero_stats').update(rest).eq('id', id);
            if (!error) {
                setShowStatsForm(false);
                resetStatsForm();
                fetchHeroStats();
            } else alert(error.message);
        } else {
            const { error } = await supabase.from('hero_stats').insert([rest]);
            if (!error) {
                setShowStatsForm(false);
                resetStatsForm();
                fetchHeroStats();
            } else alert(error.message);
        }
        setStatsSaving(false);
    };

    const resetStatsForm = () => {
        setStatsFormData({
            title: '',
            subtitle: '',
            highlight: '',
            suffix: '',
            description: '',
            image: '',
            sort_order: stats.length,
        });
    };

    const handleEditStat = (stat: HeroStat) => {
        setStatsFormData(stat);
        setShowStatsForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const deleteStat = async (id: string) => {
        if (!confirm('Delete this hero stat?')) return;
        const { error } = await supabase.from('hero_stats').delete().eq('id', id);
        if (!error) fetchHeroStats();
    };

    const fetchMilestones = async () => {
        setMilestonesLoading(true);
        const { data, error } = await supabase
            .from('milestones')
            .select('*')
            .order('sort_order', { ascending: true });
        if (!error && data) {
            setMilestones(data.map((row: Record<string, unknown>) => ({
                id: row.id as string,
                year: String(row.year ?? ''),
                title: String(row.title ?? ''),
                description: String(row.description ?? row.story ?? ''),
                images: Array.isArray(row.images) ? (row.images as string[]) : [],
                tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
                side: (row.side === 'right' || row.side === 'center' ? row.side : 'left') as 'left' | 'right' | 'center',
                sort_order: typeof row.sort_order === 'number' ? row.sort_order : 0,
            })));
        }
        setMilestonesLoading(false);
    };

    const handleMilestoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMilestonesSaving(true);
        const { id, ...rest } = milestoneFormData;
        if (id) {
            const { error } = await supabase.from('milestones').update(rest).eq('id', id);
            if (!error) {
                setShowMilestoneForm(false);
                resetMilestoneForm();
                fetchMilestones();
            } else alert(error.message);
        } else {
            const { error } = await supabase.from('milestones').insert([rest]);
            if (!error) {
                setShowMilestoneForm(false);
                resetMilestoneForm();
                fetchMilestones();
            } else alert(error.message);
        }
        setMilestonesSaving(false);
    };

    const resetMilestoneForm = () => {
        setMilestoneFormData({
            year: '',
            title: '',
            description: '',
            images: [],
            tags: [],
            side: 'left',
            sort_order: milestones.length,
        });
    };

    const handleEditMilestone = (m: Milestone) => {
        setMilestoneFormData(m);
        setShowMilestoneForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const deleteMilestone = async (id: string) => {
        if (!confirm('Delete this milestone?')) return;
        const { error } = await supabase.from('milestones').delete().eq('id', id);
        if (!error) fetchMilestones();
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-600/30">
            {/* Header */}
            <nav className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center font-bold text-xl shadow-[0_0_20px_rgba(220,38,38,0.3)]">
                            M
                        </div>
                        <div>
                            <h1 className="font-bold tracking-tight text-lg">Mantaka Admin</h1>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">Portfolio Manager v1.0</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {activeTab === 'projects' ? (
                            <button
                                onClick={() => {
                                    if (showForm) {
                                        setShowForm(false);
                                        resetForm();
                                    } else setShowForm(true);
                                    setShowStatsForm(false);
                                }}
                                className="bg-white text-black hover:bg-white/90 px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 group"
                            >
                                <Plus className={`w-4 h-4 transition-transform duration-300 ${showForm ? 'rotate-45' : ''}`} />
                                {showForm ? 'Cancel' : 'Add Project'}
                            </button>
                        ) : activeTab === 'milestones' ? (
                            <button
                                onClick={() => {
                                    if (showMilestoneForm) {
                                        setShowMilestoneForm(false);
                                        resetMilestoneForm();
                                    } else {
                                        setShowMilestoneForm(true);
                                        setMilestoneFormData((prev) => ({ ...prev, sort_order: milestones.length }));
                                    }
                                    setShowForm(false);
                                    setShowStatsForm(false);
                                }}
                                className="bg-white text-black hover:bg-white/90 px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 group"
                            >
                                <Plus className={`w-4 h-4 transition-transform duration-300 ${showMilestoneForm ? 'rotate-45' : ''}`} />
                                {showMilestoneForm ? 'Cancel' : 'Add Milestone'}
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    if (showStatsForm) {
                                        setShowStatsForm(false);
                                        resetStatsForm();
                                    } else {
                                        setShowStatsForm(true);
                                        setStatsFormData((prev) => ({ ...prev, sort_order: stats.length }));
                                    }
                                    setShowForm(false);
                                }}
                                className="bg-white text-black hover:bg-white/90 px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 group"
                            >
                                <Plus className={`w-4 h-4 transition-transform duration-300 ${showStatsForm ? 'rotate-45' : ''}`} />
                                {showStatsForm ? 'Cancel' : 'Add Stat'}
                            </button>
                        )}
                        <button
                            onClick={handleLogout}
                            className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
                            title="Sign Out"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex gap-2 mb-8 border-b border-white/10 pb-2">
                    <button
                        onClick={() => { setActiveTab('projects'); setShowStatsForm(false); setShowMilestoneForm(false); }}
                        className={`px-6 py-2.5 rounded-t-lg font-bold text-sm transition-all ${activeTab === 'projects' ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                    >
                        Projects
                    </button>
                    <button
                        onClick={() => { setActiveTab('stats'); setShowForm(false); setShowMilestoneForm(false); }}
                        className={`px-6 py-2.5 rounded-t-lg font-bold text-sm transition-all ${activeTab === 'stats' ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                    >
                        Hero Stats
                    </button>
                    <button
                        onClick={() => { setActiveTab('milestones'); setShowForm(false); setShowStatsForm(false); }}
                        className={`px-6 py-2.5 rounded-t-lg font-bold text-sm transition-all ${activeTab === 'milestones' ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                    >
                        Milestones
                    </button>
                </div>

                {showForm && activeTab === 'projects' && (
                    <div className="mb-16 bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="p-8 border-b border-white/5 bg-gradient-to-r from-red-600/10 to-transparent">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                {formData.id ? <Pencil className="text-red-600" /> : <Plus className="text-red-600" />}
                                {formData.id ? 'Edit Project' : 'New Project'}
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Basic Info</label>
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            placeholder="Project Title"
                                            className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-red-600 transition-colors"
                                            value={formData.title || ''}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                placeholder="Category (e.g. AI-TECH)"
                                                className="bg-[#111] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-red-600 transition-colors"
                                                value={formData.category || ''}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Theme Color</label>
                                            <div className="grid grid-cols-6 gap-2">
                                                {COLOR_PRESETS.map((color) => (
                                                    <button
                                                        key={color.value}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, background_color: color.value })}
                                                        className={`h-10 w-full rounded-lg border-2 transition-all ${formData.background_color === color.value
                                                            ? 'border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.5)] z-10'
                                                            : 'border-transparent hover:scale-105 hover:border-white/20'
                                                            }`}
                                                        style={{ backgroundColor: color.value }}
                                                        title={color.name}
                                                    />
                                                ))}
                                                <div className="relative h-10 w-full rounded-lg overflow-hidden border border-white/10 group hover:border-white/30 transition-colors">
                                                    <input
                                                        type="color"
                                                        className="absolute inset-0 w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer p-0 border-0"
                                                        value={formData.background_color || ''}
                                                        onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                                                        title="Custom Color"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                        <Plus className="w-4 h-4 text-white mix-blend-difference" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Subtitle (Short list of tags/features)"
                                            className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-red-600 transition-colors"
                                            value={formData.subtitle || ''}
                                            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description</label>
                                    <textarea
                                        placeholder="Short project summary..."
                                        rows={4}
                                        className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-red-600 transition-colors resize-none mb-6"
                                        value={formData.description || ''}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />

                                    <div className="space-y-6 border-t border-white/5 pt-6">
                                        <h3 className="text-sm font-bold text-red-500 uppercase tracking-widest">Story Mode</h3>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">The Spark (Origin/Challenge)</label>
                                            <textarea
                                                placeholder="How did this start? What was the hard problem? (Brainstorming phase)"
                                                rows={4}
                                                className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-red-600 transition-colors"
                                                value={formData.story_challenge || ''}
                                                onChange={(e) => setFormData({ ...formData, story_challenge: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">The Blueprint (System Design/Algo)</label>
                                            <textarea
                                                placeholder="Deep dive into algorithms, system design, and technical decisions."
                                                rows={6}
                                                className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-red-600 transition-colors font-mono text-sm"
                                                value={formData.story_solution || ''}
                                                onChange={(e) => setFormData({ ...formData, story_solution: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">The Legacy (Outcome/Learnings)</label>
                                            <textarea
                                                placeholder="What was the result? What did you learn? Collaboration highlights?"
                                                rows={4}
                                                className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-red-600 transition-colors"
                                                value={formData.story_outcome || ''}
                                                onChange={(e) => setFormData({ ...formData, story_outcome: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Tech Stack (Comma separated)</label>
                                    <input
                                        type="text"
                                        placeholder="Next.js, Three.js, GSAP..."
                                        className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-red-600 transition-colors"
                                        value={(formData.tech_stack || []).join(', ')}
                                        onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value.split(',').map(s => s.trim()) })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Media Upload (Cloudinary)</label>
                                    <div className="bg-[#111] border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 text-center">
                                        {formData.src ? (
                                            <div className="relative group w-full aspect-video rounded-xl overflow-hidden shadow-2xl">
                                                <img src={formData.src} alt="Preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, src: '' })}
                                                        className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-colors"
                                                        title="Remove Image"
                                                    >
                                                        <Trash2 className="w-6 h-6" />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <CldUploadWidget
                                                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "portfolio_preset"}
                                                options={{
                                                    folder: 'portfolio',
                                                    singleUploadAutoClose: true,
                                                    resourceType: 'auto'
                                                }}
                                                onSuccess={(result: any) => {
                                                    const url = result?.info?.secure_url;
                                                    setFormData({ ...formData, src: url });
                                                }}
                                            >
                                                {({ open }) => (
                                                    <button
                                                        type="button"
                                                        onClick={() => open()}
                                                        className="bg-white/5 hover:bg-white/10 p-12 w-full rounded-2xl transition-all border border-white/5 hover:border-white/20 group"
                                                    >
                                                        <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                                            <ImageIcon className="text-red-600 w-8 h-8" />
                                                        </div>
                                                        <span className="text-sm font-bold text-gray-300">Upload Hero Media</span>
                                                        <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-widest font-medium">Auto-organized into 'portfolio' folder</p>
                                                    </button>
                                                )}
                                            </CldUploadWidget>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Gallery Media (Images & Videos)</label>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            {formData.media?.map((item, index) => (
                                                <div key={index} className="relative group aspect-video bg-[#111] rounded-xl overflow-hidden border border-white/5">
                                                    {item.type === 'video' ? (
                                                        <video src={item.url} className="w-full h-full object-cover" controls />
                                                    ) : (
                                                        <img src={item.url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newMedia = [...(formData.media || [])];
                                                            newMedia.splice(index, 1);
                                                            setFormData({ ...formData, media: newMedia });
                                                        }}
                                                        className="absolute top-2 right-2 bg-red-600/80 p-1.5 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        <CldUploadWidget
                                            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "portfolio_preset"}
                                            options={{
                                                folder: 'portfolio/gallery',
                                                resourceType: 'auto'
                                            }}
                                            onSuccess={(result: any) => {
                                                const url = result?.info?.secure_url;
                                                const type = result?.info?.resource_type === 'video' ? 'video' : 'image';
                                                if (url) {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        media: [...(prev.media || []), { type, url }]
                                                    }));
                                                }
                                            }}
                                        >
                                            {({ open }) => (
                                                <button
                                                    type="button"
                                                    onClick={() => open()}
                                                    className="w-full bg-[#111] border-2 border-dashed border-white/10 rounded-xl p-6 hover:border-white/20 hover:bg-white/5 transition-all text-gray-400 hover:text-white flex flex-col items-center gap-2 group"
                                                >
                                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        <Plus className="w-5 h-5" />
                                                    </div>
                                                    <span className="text-xs font-bold uppercase tracking-widest">Add Gallery Item</span>
                                                </button>
                                            )}
                                        </CldUploadWidget>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Code Link (GitHub)</label>
                                        <input
                                            type="url"
                                            className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-red-600 transition-colors"
                                            value={formData.code_link || ''}
                                            onChange={(e) => setFormData({ ...formData, code_link: e.target.value })}
                                            placeholder="https://github.com/..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Demo Link</label>
                                        <input
                                            type="url"
                                            className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-red-600 transition-colors"
                                            value={formData.demo_link || ''}
                                            onChange={(e) => setFormData({ ...formData, demo_link: e.target.value })}
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Award Name</label>
                                        <input
                                            type="text"
                                            className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-red-600 transition-colors"
                                            value={formData.award_name || ''}
                                            onChange={(e) => setFormData({ ...formData, award_name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Award Link</label>
                                        <input
                                            type="text"
                                            className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-red-600 transition-colors"
                                            value={formData.award_link || ''}
                                            onChange={(e) => setFormData({ ...formData, award_link: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all shadow-xl hover:shadow-red-600/30 flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            {formData.id ? 'Update Project' : 'Publish Project'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {showStatsForm && activeTab === 'stats' && (
                    <div className="mb-16 bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="p-8 border-b border-white/5 bg-gradient-to-r from-red-600/10 to-transparent">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                {statsFormData.id ? <Pencil className="text-red-600" /> : <Plus className="text-red-600" />}
                                {statsFormData.id ? 'Edit Hero Stat' : 'New Hero Stat'}
                            </h2>
                        </div>
                        <form onSubmit={handleStatsSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Title & Subtitle</label>
                                    <input
                                        type="text"
                                        placeholder="Title (e.g. Hackathon)"
                                        className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-red-600 transition-colors mb-4"
                                        value={statsFormData.title}
                                        onChange={(e) => setStatsFormData({ ...statsFormData, title: e.target.value })}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Subtitle (e.g. Victories)"
                                        className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-red-600 transition-colors"
                                        value={statsFormData.subtitle}
                                        onChange={(e) => setStatsFormData({ ...statsFormData, subtitle: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Highlight & Suffix</label>
                                    <div className="flex gap-4">
                                        <input
                                            type="text"
                                            placeholder="Highlight (e.g. 6)"
                                            className="flex-1 bg-[#111] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-red-600 transition-colors"
                                            value={statsFormData.highlight}
                                            onChange={(e) => setStatsFormData({ ...statsFormData, highlight: e.target.value })}
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="Suffix (e.g. + or yrs)"
                                            className="w-24 bg-[#111] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-red-600 transition-colors"
                                            value={statsFormData.suffix}
                                            onChange={(e) => setStatsFormData({ ...statsFormData, suffix: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description</label>
                                    <textarea
                                        placeholder="Short description for the reel..."
                                        rows={4}
                                        className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-red-600 transition-colors resize-none"
                                        value={statsFormData.description}
                                        onChange={(e) => setStatsFormData({ ...statsFormData, description: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Sort Order</label>
                                    <input
                                        type="number"
                                        min={0}
                                        className="w-24 bg-[#111] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-red-600 transition-colors"
                                        value={statsFormData.sort_order}
                                        onChange={(e) => setStatsFormData({ ...statsFormData, sort_order: parseInt(e.target.value, 10) || 0 })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Image URL or Upload</label>
                                    {statsFormData.image ? (
                                        <div className="relative group aspect-video rounded-xl overflow-hidden bg-[#111] border border-white/5">
                                            <img src={statsFormData.image} alt="Stat" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setStatsFormData({ ...statsFormData, image: '' })}
                                                className="absolute top-2 right-2 bg-red-600 p-2 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <CldUploadWidget
                                            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'portfolio_preset'}
                                            options={{ folder: 'portfolio', singleUploadAutoClose: true, resourceType: 'image' }}
                                            onSuccess={(result: any) => {
                                                const url = result?.info?.secure_url;
                                                if (url) setStatsFormData({ ...statsFormData, image: url });
                                            }}
                                        >
                                            {({ open }) => (
                                                <button
                                                    type="button"
                                                    onClick={() => open()}
                                                    className="w-full p-8 border-2 border-dashed border-white/10 rounded-xl hover:border-red-600/50 transition-colors flex flex-col items-center gap-2"
                                                >
                                                    <ImageIcon className="w-10 h-10 text-gray-500" />
                                                    <span className="text-sm font-medium text-gray-400">Upload image</span>
                                                </button>
                                            )}
                                        </CldUploadWidget>
                                    )}
                                    <input
                                        type="url"
                                        placeholder="Or paste image URL"
                                        className="w-full mt-2 bg-[#111] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-red-600 transition-colors text-sm"
                                        value={statsFormData.image}
                                        onChange={(e) => setStatsFormData({ ...statsFormData, image: e.target.value })}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={statsSaving}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {statsSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    {statsFormData.id ? 'Update Stat' : 'Add Stat'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {showMilestoneForm && activeTab === 'milestones' && (
                    <div className="mb-16 bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="p-8 border-b border-white/5 bg-gradient-to-r from-red-600/10 to-transparent">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                {milestoneFormData.id ? <Pencil className="text-red-600" /> : <Plus className="text-red-600" />}
                                {milestoneFormData.id ? 'Edit Milestone' : 'New Milestone'}
                            </h2>
                        </div>
                        <form onSubmit={handleMilestoneSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Year & Title</label>
                                    <div className="flex gap-4 mb-4">
                                        <input
                                            type="text"
                                            placeholder="Year (e.g. 2024)"
                                            className="w-24 bg-[#111] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-red-600 transition-colors"
                                            value={milestoneFormData.year}
                                            onChange={(e) => setMilestoneFormData({ ...milestoneFormData, year: e.target.value })}
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="Title"
                                            className="flex-1 bg-[#111] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-red-600 transition-colors"
                                            value={milestoneFormData.title}
                                            onChange={(e) => setMilestoneFormData({ ...milestoneFormData, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Story / Description</label>
                                    <textarea
                                        placeholder="The story for this milestone..."
                                        rows={6}
                                        className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-red-600 transition-colors resize-none"
                                        value={milestoneFormData.description}
                                        onChange={(e) => setMilestoneFormData({ ...milestoneFormData, description: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Tags (Comma separated)</label>
                                    <input
                                        type="text"
                                        placeholder="React, Node.js, Leadership..."
                                        className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-red-600 transition-colors"
                                        value={(milestoneFormData.tags || []).join(', ')}
                                        onChange={(e) => setMilestoneFormData({ ...milestoneFormData, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                                    />
                                </div>
                                <div className="flex gap-4 items-center">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Side on timeline</label>
                                    <select
                                        className="bg-[#111] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-red-600 transition-colors"
                                        value={milestoneFormData.side}
                                        onChange={(e) => setMilestoneFormData({ ...milestoneFormData, side: e.target.value as 'left' | 'right' | 'center' })}
                                    >
                                        <option value="left">Left</option>
                                        <option value="right">Right</option>
                                        <option value="center">Center</option>
                                    </select>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Order</label>
                                    <input
                                        type="number"
                                        min={0}
                                        className="w-20 bg-[#111] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-red-600 transition-colors"
                                        value={milestoneFormData.sort_order}
                                        onChange={(e) => setMilestoneFormData({ ...milestoneFormData, sort_order: parseInt(e.target.value, 10) || 0 })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Images</label>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            {milestoneFormData.images?.map((url, index) => (
                                                <div key={index} className="relative group aspect-video bg-[#111] rounded-xl overflow-hidden border border-white/5">
                                                    <img src={url} alt={`Milestone ${index}`} className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newImages = [...(milestoneFormData.images || [])];
                                                            newImages.splice(index, 1);
                                                            setMilestoneFormData({ ...milestoneFormData, images: newImages });
                                                        }}
                                                        className="absolute top-2 right-2 bg-red-600/80 p-1.5 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <CldUploadWidget
                                            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'portfolio_preset'}
                                            options={{ folder: 'portfolio/milestones', resourceType: 'image' }}
                                            onSuccess={(result: any) => {
                                                const url = result?.info?.secure_url;
                                                if (url) setMilestoneFormData(prev => ({ ...prev, images: [...(prev.images || []), url] }));
                                            }}
                                        >
                                            {({ open }) => (
                                                <button
                                                    type="button"
                                                    onClick={() => open()}
                                                    className="w-full bg-[#111] border-2 border-dashed border-white/10 rounded-xl p-6 hover:border-white/20 hover:bg-white/5 transition-all text-gray-400 hover:text-white flex flex-col items-center gap-2 group"
                                                >
                                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        <Plus className="w-5 h-5" />
                                                    </div>
                                                    <span className="text-xs font-bold uppercase tracking-widest">Add Image</span>
                                                </button>
                                            )}
                                        </CldUploadWidget>
                                        <input
                                            type="url"
                                            placeholder="Or paste image URL and press Enter"
                                            className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-red-600 transition-colors text-sm"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const input = e.currentTarget;
                                                    const url = input.value.trim();
                                                    if (url) {
                                                        setMilestoneFormData(prev => ({ ...prev, images: [...(prev.images || []), url] }));
                                                        input.value = '';
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={milestonesSaving}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {milestonesSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    {milestoneFormData.id ? 'Update Milestone' : 'Add Milestone'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {activeTab === 'projects' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-4xl font-black tracking-tighter">PROJECTS</h2>
                        <div className="h-px bg-white/10 flex-grow mx-8 hidden md:block" />
                        <span className="text-gray-500 font-mono text-sm">{projects.length} TOTAL</span>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-4 border border-white/5 rounded-3xl bg-white/[0.02]">
                            <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
                            <p className="text-gray-500 font-bold tracking-widest uppercase text-[10px]">Loading Database...</p>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-6 border border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                                <Plus className="text-gray-600 w-8 h-8" />
                            </div>
                            <div className="text-center">
                                <p className="text-xl font-bold text-gray-400">Your portfolio is empty</p>
                                <p className="text-gray-600 text-sm mt-1">Click "Add Project" to start building your legacy.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project) => (
                                <div key={project.id} className="group bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 hover:border-red-600/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(220,38,38,0.1)]">
                                    <div className="aspect-video rounded-xl overflow-hidden mb-6 bg-white/5 relative">
                                        {project.src ? (
                                            <img src={project.src} alt={project.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-[#111]">
                                                <ImageIcon className="text-white/20 w-12 h-12" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 bg-black/80 backdrop-blur-md rounded-full text-[10px] font-bold tracking-widest text-white border border-white/10">
                                                {project.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-xl font-bold tracking-tight">{project.title}</h3>
                                                <p className="text-gray-500 text-xs mt-1 line-clamp-1">{project.subtitle}</p>
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEdit(project)}
                                                    className="p-2 hover:bg-white/20 text-gray-500 hover:text-white rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => deleteProject(project.id!)}
                                                    className="p-2 hover:bg-red-900/20 text-gray-500 hover:text-red-500 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {project.tech_stack.slice(0, 3).map((tech, i) => (
                                                <span key={i} className="text-[9px] font-bold text-gray-400 uppercase tracking-wider bg-white/5 px-2 py-1 rounded-md border border-white/5">
                                                    {tech}
                                                </span>
                                            ))}
                                            {project.tech_stack.length > 3 && <span className="text-[9px] text-gray-600 font-bold">+{project.tech_stack.length - 3}</span>}
                                        </div>

                                        <div className="h-px bg-white/10" />

                                        <div className="flex items-center justify-between pt-2">
                                            <span className="text-[10px] font-mono text-gray-600">ID: {project.id?.slice(0, 8)}...</span>
                                            {project.slug && (
                                                <a href={`/work/${project.slug}`} target="_blank" className="text-gray-600 hover:text-white p-1 transition-colors text-[10px] font-mono uppercase">
                                                    /work/{project.slug}
                                                </a>
                                            )}
                                            {project.link && (
                                                <a href={project.link} target="_blank" className="text-red-600 hover:text-red-400 p-1 transition-colors">
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                )}

                {activeTab === 'stats' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-4xl font-black tracking-tighter">HERO STATS</h2>
                        <div className="h-px bg-white/10 flex-grow mx-8 hidden md:block" />
                        <span className="text-gray-500 font-mono text-sm">{stats.length} TOTAL</span>
                    </div>
                    {statsLoading ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-4 border border-white/5 rounded-3xl bg-white/[0.02]">
                            <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
                            <p className="text-gray-500 font-bold tracking-widest uppercase text-[10px]">Loading...</p>
                        </div>
                    ) : stats.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-6 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
                            <p className="text-xl font-bold text-gray-400">No hero stats yet</p>
                            <p className="text-gray-600 text-sm">Click &quot;Add Stat&quot; to add slides to the stats reel.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {stats.map((stat) => (
                                <div key={stat.id} className="group bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 hover:border-red-600/50 transition-all">
                                    <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-white/5 relative">
                                        {stat.image ? (
                                            <img src={stat.image} alt={stat.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ImageIcon className="text-white/20 w-12 h-12" />
                                            </div>
                                        )}
                                        <div className="absolute top-2 left-2">
                                            <span className="px-2 py-1 bg-black/80 rounded text-xs font-bold text-red-500">{stat.highlight}{stat.suffix}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold tracking-tight">{stat.title}</h3>
                                    <p className="text-gray-500 text-sm">{stat.subtitle}</p>
                                    <p className="text-gray-600 text-xs mt-2 line-clamp-2">{stat.description}</p>
                                    <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEditStat(stat)} className="p-2 hover:bg-white/20 text-gray-500 hover:text-white rounded-lg" title="Edit"><Pencil className="w-4 h-4" /></button>
                                        <button onClick={() => deleteStat(stat.id!)} className="p-2 hover:bg-red-900/20 text-gray-500 hover:text-red-500 rounded-lg" title="Delete"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                )}

                {activeTab === 'milestones' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-4xl font-black tracking-tighter">MILESTONES</h2>
                        <div className="h-px bg-white/10 flex-grow mx-8 hidden md:block" />
                        <span className="text-gray-500 font-mono text-sm">{milestones.length} TOTAL</span>
                    </div>
                    {milestonesLoading ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-4 border border-white/5 rounded-3xl bg-white/[0.02]">
                            <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
                            <p className="text-gray-500 font-bold tracking-widest uppercase text-[10px]">Loading...</p>
                        </div>
                    ) : milestones.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-6 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
                            <p className="text-xl font-bold text-gray-400">No milestones yet</p>
                            <p className="text-gray-600 text-sm">Click &quot;Add Milestone&quot; to build your About timeline. Create the <code className="bg-white/10 px-1 rounded">milestones</code> table in Supabase first.</p>
                            <a href="/about" target="_blank" className="text-red-500 hover:text-red-400 text-sm font-mono">View /about page →</a>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {milestones.map((m) => (
                                <div key={m.id} className="group bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 hover:border-red-600/50 transition-all">
                                    <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-white/5 relative">
                                        {m.images?.[0] ? (
                                            <img src={m.images[0]} alt={m.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ImageIcon className="text-white/20 w-12 h-12" />
                                            </div>
                                        )}
                                        <div className="absolute top-2 left-2">
                                            <span className="px-2 py-1 bg-black/80 rounded text-xs font-bold text-red-500">{m.year}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold tracking-tight">{m.title}</h3>
                                    <p className="text-gray-600 text-xs mt-2 line-clamp-2">{m.description}</p>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {m.tags?.slice(0, 3).map((tag, i) => (
                                            <span key={i} className="text-[9px] font-bold text-gray-500 uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded border border-white/5">{tag}</span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEditMilestone(m)} className="p-2 hover:bg-white/20 text-gray-500 hover:text-white rounded-lg" title="Edit"><Pencil className="w-4 h-4" /></button>
                                        <button onClick={() => deleteMilestone(m.id!)} className="p-2 hover:bg-red-900/20 text-gray-500 hover:text-red-500 rounded-lg" title="Delete"><Trash2 className="w-4 h-4" /></button>
                                        <a href="/about" target="_blank" className="p-2 hover:bg-white/20 text-gray-500 hover:text-white rounded-lg" title="View About"><ExternalLink className="w-4 h-4" /></a>
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
