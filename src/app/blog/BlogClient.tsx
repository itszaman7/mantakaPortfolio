'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
}

export default function BlogClient({ blogs }: { blogs: Blog[] }) {
    const containerRef = useRef<HTMLElement>(null);

    const featuredBlog = blogs.length > 0 ? blogs[0] : null;
    const otherBlogs = blogs.length > 1 ? blogs.slice(1) : [];

    useGSAP(() => {
        if (blogs.length === 0) return;

        gsap.fromTo('.anim-hero-text',
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power3.out" }
        );

        gsap.fromTo('.anim-featured',
            { scale: 0.97, opacity: 0, y: 30 },
            {
                scale: 1,
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "expo.out",
                scrollTrigger: {
                    trigger: '.anim-featured',
                    start: "top 85%",
                }
            }
        );

        gsap.fromTo('.anim-grid-item',
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: '.anim-grid-container',
                    start: "top 80%",
                }
            }
        );

        ScrollTrigger.refresh();
    }, { dependencies: [blogs], scope: containerRef });

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

            <section className="py-32 px-6 md:px-12 lg:px-24 relative z-10 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-end justify-between border-b border-gray-100 pb-8 mb-24">
                        <h2 className="text-4xl md:text-5xl lg:text-[4rem] font-sans font-bold text-black tracking-tighter leading-none">LATEST ARTICLES</h2>
                        <span className="font-mono text-xs font-bold text-gray-400 uppercase tracking-widest pl-4">( 01 )</span>
                    </div>

                    {blogs.length === 0 ? (
                        <div className="font-mono text-gray-400 bg-gray-50 py-16 rounded-2xl text-center">
                            /&gt; No records compiled yet.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-32">
                            {featuredBlog && (
                                <Link href={`/blog/${featuredBlog.slug}`} className="anim-featured group block cursor-pointer">
                                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 border border-gray-100">
                                        <div className="flex flex-col lg:flex-row">
                                            <div className="w-full lg:w-[45%] p-10 lg:p-16 flex flex-col justify-center relative bg-white z-10">
                                                <div className="font-mono text-[10px] mb-8 text-gray-400 font-bold uppercase tracking-widest">
                                                    [ {new Date(featuredBlog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} ]
                                                </div>
                                                <h3 className="text-4xl md:text-[3.25rem] font-serif text-black leading-[1.05] mb-8 group-hover:text-red-600 transition-colors duration-500">
                                                    {featuredBlog.title}
                                                </h3>
                                                <p className="text-base text-gray-500 font-sans leading-relaxed mb-12">
                                                    {featuredBlog.excerpt}
                                                </p>
                                                <div className="mt-auto">
                                                    <span className="inline-flex items-center gap-3 font-mono text-[11px] font-bold uppercase text-black pb-1 border-b-2 border-transparent group-hover:border-red-600 transition-colors duration-300">
                                                        Read Article <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="w-full lg:w-[55%] aspect-video lg:aspect-auto relative overflow-hidden bg-gray-100">
                                                {featuredBlog.cover_image ? (
                                                    <img src={featuredBlog.cover_image} alt={featuredBlog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center font-serif text-6xl text-gray-200 bg-gray-50">M.</div>
                                                )}
                                                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500"></div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )}

                            {otherBlogs.length > 0 && (
                                <div className="anim-grid-container">
                                    <div className="flex items-center gap-4 mb-16">
                                        <h3 className="font-serif text-3xl text-black">More Articles</h3>
                                        <div className="h-px bg-gray-200 flex-1 ml-4"></div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-x-12 md:gap-y-16">
                                        {otherBlogs.map(blog => (
                                            <Link href={`/blog/${blog.slug}`} key={blog.id} className="anim-grid-item group flex flex-col h-full cursor-pointer">
                                                <div className="w-full aspect-[4/3] bg-gray-100 overflow-hidden relative rounded-2xl mb-8">
                                                    {blog.cover_image ? (
                                                        <img src={blog.cover_image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center font-serif text-4xl text-gray-300 bg-gray-50">M.</div>
                                                    )}
                                                </div>
                                                <div className="flex-1 flex flex-col">
                                                    <div className="font-mono text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-3">
                                                        {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                    </div>
                                                    <h4 className="text-2xl font-serif text-black leading-snug mb-4 group-hover:text-red-600 transition-colors">
                                                        {blog.title}
                                                    </h4>
                                                    <p className="text-gray-500 text-sm font-sans line-clamp-3 leading-relaxed mb-8">
                                                        {blog.excerpt}
                                                    </p>
                                                    <div className="mt-auto border-t border-gray-100 pt-6 flex items-center justify-between">
                                                        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-black group-hover:text-red-600 transition-colors pb-1 border-b border-transparent group-hover:border-red-600">
                                                            Read Article
                                                        </span>
                                                        <span className="text-black group-hover:text-red-600 group-hover:translate-x-1 transition-all">→</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
