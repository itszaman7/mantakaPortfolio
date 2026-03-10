'use client';

import { useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Loader2 } from 'lucide-react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface Blog {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    cover_image: string;
    published: boolean;
    created_at: string;
    author: string;
    tags?: string[];
}

export default function BlogClient({ blogs }: { blogs: Blog[] }) {
    const containerRef = useRef<HTMLElement>(null);
    const router = useRouter();

    const [selectedTag, setSelectedTag] = useState<string>('All');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
    const [loadingId, setLoadingId] = useState<string | null>(null);

    // Extract unique tags
    const allTags = useMemo(() => {
        const tags = new Set<string>();
        blogs.forEach(blog => {
            if (blog.tags && Array.isArray(blog.tags)) {
                blog.tags.forEach(tag => tags.add(tag));
            }
        });
        return ['All', ...Array.from(tags).sort()];
    }, [blogs]);

    // Filter and sort blogs
    const filteredBlogs = useMemo(() => {
        let filtered = [...blogs];

        if (selectedTag !== 'All') {
            filtered = filtered.filter(blog => blog.tags?.includes(selectedTag));
        }

        filtered.sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

        return filtered;
    }, [blogs, selectedTag, sortOrder]);


    useGSAP(() => {
        if (blogs.length === 0) return;

        gsap.fromTo('.anim-hero-text',
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power3.out" }
        );

        gsap.fromTo('.anim-grid-item',
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: '.anim-grid-container',
                    start: "top 80%",
                }
            }
        );

        ScrollTrigger.refresh();
    }, { dependencies: [filteredBlogs], scope: containerRef });

    return (
        <main ref={containerRef} className="min-h-screen bg-white text-black selection:bg-red-600 selection:text-white overflow-x-hidden pt-32 relative">
            <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

            <section className="px-6 md:px-12 lg:px-24 pb-20 relative z-10">
                <div className="max-w-7xl mx-auto border-b border-gray-100 pb-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                        <div>
                            <div className="anim-hero-text flex items-center gap-3 mb-8">
                                <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                                <span className="font-mono text-xs uppercase tracking-widest text-gray-500">Mantaka /</span>
                                <span className="font-mono text-xs uppercase tracking-widest text-black font-bold">Tech Blog</span>
                            </div>
                            <h1 className="anim-hero-text text-6xl md:text-[7rem] lg:text-[10rem] font-serif leading-[0.9] text-black tracking-tighter mb-4">
                                CODE <span className="font-sans text-red-600">&</span><br />
                                DESIGN<span className="text-red-600">.</span>
                            </h1>
                        </div>
                        <div className="anim-hero-text md:w-[35%] flex flex-col justify-end pb-4">
                            <p className="font-mono text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-4 border-b border-gray-100 pb-2 w-max">
                                / Philosophy
                            </p>
                            <p className="text-sm font-sans text-gray-600 leading-relaxed">
                                Documenting the journey of pixels, performance, and problem-solving. This archive explores architectural deep dives, UI/UX experiments, and the beauty of software engineering.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 px-6 md:px-12 lg:px-24 relative z-10 bg-white">
                <div className="max-w-7xl mx-auto">

                    {/* Filter Bar */}
                    <div className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-gray-100 pb-8">
                        {/* Tags */}
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-2">Filter Topics:</span>
                            {allTags.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => setSelectedTag(tag)}
                                    className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-widest transition-all duration-300 border ${selectedTag === tag
                                        ? 'bg-red-600 border-red-600 text-white shadow-md'
                                        : 'bg-transparent border-gray-200 text-gray-500 hover:border-gray-400 hover:text-black'
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>

                        {/* Sort */}
                        <div className="flex items-center gap-3 shrink-0">
                            <span className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sort:</span>
                            <div className="bg-gray-50 rounded-lg p-1 flex">
                                <button
                                    onClick={() => setSortOrder('newest')}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${sortOrder === 'newest' ? 'bg-white shadow text-black' : 'text-gray-400 hover:text-black'}`}
                                >
                                    Newest
                                </button>
                                <button
                                    onClick={() => setSortOrder('oldest')}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${sortOrder === 'oldest' ? 'bg-white shadow text-black' : 'text-gray-400 hover:text-black'}`}
                                >
                                    Oldest
                                </button>
                            </div>
                        </div>
                    </div>

                    {blogs.length === 0 ? (
                        <div className="font-mono text-gray-400 bg-gray-50 py-16 rounded-2xl text-center">
                            /&gt; No records compiled yet.
                        </div>
                    ) : filteredBlogs.length === 0 ? (
                        <div className="font-mono text-gray-400 py-16 text-center border border-dashed border-gray-200 rounded-2xl">
                            /&gt; No articles found for tag: {selectedTag}
                        </div>
                    ) : (
                        <div className="anim-grid-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-x-10 md:gap-y-16">
                            {filteredBlogs.map(blog => (
                                <div
                                    key={blog.id}
                                    onClick={() => {
                                        setLoadingId(blog.id);
                                        router.push(`/blog/${blog.slug}`);
                                    }}
                                    className="anim-grid-item group flex flex-col h-full cursor-pointer relative"
                                >
                                    <div className="w-full aspect-[4/3] bg-gray-100 overflow-hidden relative rounded-2xl mb-6 shadow-sm">
                                        {blog.cover_image ? (
                                            <img src={blog.cover_image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center font-serif text-4xl text-gray-300 bg-gray-50">M.</div>
                                        )}

                                        {/* Loading Overlay */}
                                        {loadingId === blog.id && (
                                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-20 flex items-center justify-center animate-in fade-in duration-300">
                                                <div className="flex flex-col items-center gap-3">
                                                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                                                    <span className="font-mono text-[10px] text-white font-bold uppercase tracking-widest">Preparing...</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Tags overlay */}
                                        {blog.tags && blog.tags.length > 0 && (
                                            <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                                                {blog.tags.slice(0, 2).map(tag => (
                                                    <span key={tag} className="bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-full font-mono text-[9px] uppercase tracking-widest">
                                                        {tag}
                                                    </span>
                                                ))}
                                                {blog.tags.length > 2 && (
                                                    <span className="bg-black/70 backdrop-blur-md text-white px-2 py-1 rounded-full font-mono text-[9px]">
                                                        +{blog.tags.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>
                                    </div>
                                    <div className="flex-1 flex flex-col">
                                        <div className="font-mono text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-3 flex items-center gap-2">
                                            {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                        </div>
                                        <h4 className="text-2xl md:text-[1.75rem] font-serif text-black leading-snug mb-3 group-hover:text-red-600 transition-colors">
                                            {blog.title}
                                        </h4>
                                        <p className="text-gray-500 text-sm font-sans line-clamp-2 leading-relaxed mb-6">
                                            {blog.excerpt}
                                        </p>
                                        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-black group-hover:text-red-600 transition-colors">
                                                Read Article
                                            </span>
                                            <span className="text-black group-hover:text-red-600 group-hover:translate-x-1 transition-all">→</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
