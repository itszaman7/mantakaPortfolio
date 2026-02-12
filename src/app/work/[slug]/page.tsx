'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ArrowLeft } from 'lucide-react';
import { getProjectBySlug, getNextProject, type Project } from '@/components/work/projectsData';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function ProjectPage() {
    const { slug } = useParams<{ slug: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [nextProject, setNextProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadData = async () => {
            if (!slug) return;
            setLoading(true);
            const current = await getProjectBySlug(slug);
            const next = await getNextProject(slug);
            setProject(current || null);
            setNextProject(next || null);
            setLoading(false);
        };
        loadData();
    }, [slug]);

    useGSAP(() => {
        if (loading || !project || !containerRef.current) return;

        // Animate section headings
        gsap.utils.toArray<HTMLElement>('.story-heading').forEach((heading) => {
            gsap.from(heading, {
                scrollTrigger: {
                    trigger: heading,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });
        });

        // Animate text blocks
        gsap.utils.toArray<HTMLElement>('.story-text').forEach((text) => {
            gsap.from(text, {
                scrollTrigger: {
                    trigger: text,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                y: 30,
                opacity: 0,
                duration: 1,
                delay: 0.2,
                ease: 'power3.out'
            });
        });

    }, { dependencies: [loading, project], scope: containerRef });

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-neutral-800 border-t-red-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
                <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
                <Link href="/" className="text-neutral-500 hover:text-white transition-colors underline">
                    Return Home
                </Link>
            </div>
        );
    }

    return (
        <main ref={containerRef} className="bg-black text-white font-sans selection:bg-red-600 selection:text-white overflow-x-hidden">
            <style jsx global>{`
                .text-stroke { -webkit-text-stroke: 1px rgba(255, 255, 255, 0.2); color: transparent; }
            `}</style>

            {/* Back Navigation */}
            <div className="fixed top-0 left-0 p-8 z-50">
                <Link href="/" className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase hover:text-red-500 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back
                </Link>
            </div>

            {/* Hero Section */}
            <section className="min-h-screen relative flex flex-col justify-end px-8 pb-32">
                {/* Background Image with Gradient Overlay */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={project.src}
                        alt={project.title}
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto w-full">
                    <p className="text-red-500 font-black tracking-[0.5em] uppercase text-[10px] font-sans mb-6 animate-in slide-in-from-bottom-4 duration-1000">
                        {project.category}
                    </p>
                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-8 font-sans leading-none mix-blend-color-dodge animate-in slide-in-from-bottom-8 duration-1000 delay-100">
                        {project.title.toUpperCase()}
                    </h1>
                    <div className="flex flex-wrap gap-4 animate-in slide-in-from-bottom-8 duration-1000 delay-200">
                        {project.techStack?.map((tech, i) => (
                            <span key={i} className="px-4 py-2 border border-white/20 rounded-full text-[10px] font-mono tracking-wider uppercase bg-black/50 backdrop-blur-md">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Phase 1: The Spark (Origin) */}
            <section className="min-h-[80vh] flex items-center py-24 px-8 bg-[#0a0a0a] border-t border-white/5">
                <div className="max-w-4xl mx-auto w-full">
                    <span className="text-[200px] leading-none font-black text-stroke absolute -translate-x-32 -translate-y-20 opacity-20 select-none pointer-events-none font-sans hidden lg:block">01</span>
                    <h2 className="story-heading text-4xl md:text-6xl font-bold mb-12 font-sans relative">The Spark</h2>
                    <div className="story-text text-xl md:text-2xl text-neutral-400 font-light leading-relaxed max-h-[70vh] overflow-y-auto pr-2 story-scroll">
                        {project.story_challenge ? (
                            <p>{project.story_challenge}</p>
                        ) : (
                            <p>{project.description}</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Phase 2: The Blueprint (System Design/Algo) */}
            <section className="min-h-screen py-32 px-8 bg-[#050505] relative overflow-hidden">
                {/* Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                    <div className="min-w-0">
                        <span className="text-red-600 font-mono text-xs tracking-[0.3em] uppercase block mb-6">System Architecture</span>
                        <h2 className="story-heading text-4xl md:text-6xl font-bold mb-12 font-sans">The Blueprint</h2>
                        <div className="story-text font-mono text-sm md:text-base text-neutral-400 leading-relaxed space-y-8 max-h-[70vh] overflow-y-auto pr-2 story-scroll">
                            {project.story_solution ? (
                                <p className="whitespace-pre-line">{project.story_solution}</p>
                            ) : (
                                <p>Technical deep dive pending...</p>
                            )}
                        </div>
                    </div>

                    {/* Visual aide for "Blueprint" feel - could be a code snippet or diagram if available, otherwise stylized abstract */}
                    <div className="border border-white/10 rounded-xl p-8 bg-black/50 backdrop-blur-sm self-start sticky top-32">
                        <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="ml-auto text-xs font-mono text-neutral-500">system_core.ts</span>
                        </div>
                        <div className="space-y-2">
                            <div className="h-2 w-3/4 bg-neutral-800 rounded"></div>
                            <div className="h-2 w-1/2 bg-neutral-800 rounded"></div>
                            <div className="h-2 w-full bg-neutral-800 rounded"></div>
                            <div className="h-2 w-2/3 bg-neutral-800 rounded"></div>
                        </div>
                        <div className="mt-8 pt-8 border-t border-dashed border-white/10">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">Core Technologies</h4>
                            <div className="flex flex-wrap gap-2">
                                {project.techStack?.map((tech, i) => (
                                    <span key={i} className="text-[10px] text-red-500 font-mono">{`> ${tech}`}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Phase 3: The Legacy (Outcome/Gallery) */}
            <section className="min-h-screen py-32 px-8 bg-white text-black">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl mb-24">
                        <span className="text-[200px] leading-none font-black text-neutral-100 absolute -translate-x-32 -translate-y-20 select-none pointer-events-none font-sans hidden lg:block">03</span>
                        <h2 className="story-heading text-4xl md:text-6xl font-bold mb-12 font-sans relative">The Legacy</h2>
                        <div className="story-text text-xl md:text-2xl font-light leading-relaxed max-h-[70vh] overflow-y-auto pr-2 story-scroll">
                            {project.story_outcome ? (
                                <p>{project.story_outcome}</p>
                            ) : (
                                <p>Project completed successfully.</p>
                            )}
                        </div>

                        <div className="mt-12">
                            {project.link && (
                                <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-6 border-2 border-black px-10 py-4 font-black tracking-widest text-[11px] uppercase hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300 rounded-full">
                                    Visit Live Project
                                    <ArrowUpRight className="w-4 h-4" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Gallery Grid */}
                    {project.media && project.media.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {project.media.map((item, idx) => (
                                <div key={idx} className="aspect-video relative rounded-2xl overflow-hidden bg-neutral-100">
                                    {item.type === 'video' ? (
                                        <video src={item.url} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                                    ) : (
                                        <Image
                                            src={item.url}
                                            alt={`Gallery ${idx}`}
                                            fill
                                            className="object-cover hover:scale-105 transition-transform duration-700"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Next Project Footer */}
            {nextProject && (
                <footer className="px-8 py-32 bg-black text-white relative z-10">
                    <div className="max-w-7xl mx-auto text-center">
                        <p className="text-neutral-500 font-bold tracking-[0.5em] uppercase text-[10px] mb-10 font-sans">Next Chapter</p>
                        <Link href={`/work/${nextProject.slug}`} className="group inline-block">
                            <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-20 group-hover:text-neutral-500 transition-colors font-sans leading-none">
                                {nextProject.title.toUpperCase()}<br />
                                <span className="opacity-0 group-hover:opacity-100 text-red-600 text-lg tracking-widest absolute bottom-0 left-1/2 -translate-x-1/2 transition-opacity duration-300">READ STORY</span>
                            </h2>
                        </Link>

                        <div className="flex flex-col md:flex-row justify-between items-center pt-20 border-t border-white/10 gap-8">
                            <p className="text-[9px] font-bold tracking-widest text-neutral-500 uppercase font-sans">© 2026 MANTAKA</p>
                        </div>
                    </div>
                </footer>
            )}
        </main>
    );
}
