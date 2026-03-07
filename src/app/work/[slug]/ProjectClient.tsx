'use client';

import React, { useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { type Project } from '@/components/work/projectsData';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function ProjectClient({
    project,
    otherProjects,
}: {
    project: Project;
    otherProjects: Project[];
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const hintRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useLayoutEffect(() => {
        if (!containerRef.current || !innerRef.current) return;

        const ctx = gsap.context(() => {
            const inner = innerRef.current!;
            const totalWidth = inner.scrollWidth;
            const viewportWidth = window.innerWidth;

            gsap.to(inner, {
                x: -(totalWidth - viewportWidth),
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    pin: true,
                    pinReparent: false,
                    scrub: 1,
                    end: () => `+=${totalWidth - viewportWidth}`,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        if (progressRef.current) {
                            progressRef.current.style.transform = `scaleX(${self.progress})`;
                        }
                    },
                },
            });

            gsap.fromTo(
                '.intro-stagger',
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.1,
                    ease: 'expo.out',
                    delay: 0.3,
                }
            );

            if (hintRef.current) {
                gsap.to(hintRef.current, {
                    opacity: 0,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top top',
                        end: '+=300',
                        scrub: true,
                    },
                });
            }
        }, containerRef);

        return () => ctx.revert();
    }, [project]);

    const gallery = [];
    if (project.src) {
        gallery.push({ type: 'image' as const, url: project.src });
    }
    if (project.media && project.media.length > 0) {
        gallery.push(...project.media);
    }

    const techList = project.techStack ?? [];
    const year = project.year ?? new Date().getFullYear().toString();

    return (
        <div ref={containerRef} className="overflow-hidden bg-[#FBFBFA]">
            <div className="fixed bottom-0 left-0 right-0 z-50 h-[3px] bg-black/5">
                <div
                    ref={progressRef}
                    className="h-full bg-[#FF2800] origin-left"
                    style={{ transform: 'scaleX(0)' }}
                />
            </div>

            <div
                ref={hintRef}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400"
            >
                <span>Scroll to explore</span>
                <svg className="w-4 h-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16m0 0l-6-6m6 6l-6 6" />
                </svg>
            </div>

            <div
                ref={innerRef}
                className="flex h-screen w-max items-center px-6 md:px-24 gap-16 md:gap-32"
            >
                <div className="w-[90vw] md:w-[75vw] shrink-0 h-full flex flex-col justify-center pt-24 pb-12">
                    <div className="intro-stagger mb-8">
                        <Link
                            href="/work"
                            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-gray-400 hover:text-[#FF2800] transition-colors group"
                        >
                            <svg
                                className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16m0 0l-6-6m6 6l-6 6" />
                            </svg>
                            All Projects
                        </Link>
                    </div>

                    <h1 className="intro-stagger serif-font text-[12vw] md:text-[8vw] leading-[0.9] text-[#FF2800] uppercase tracking-tighter">
                        {project.title}
                    </h1>

                    {project.subtitle && (
                        <p className="intro-stagger serif-font italic text-lg md:text-xl text-[#1a1a1a]/50 mt-4">
                            {project.subtitle}
                        </p>
                    )}

                    <div className="intro-stagger mt-8 md:mt-12 text-xl md:text-3xl serif-font font-medium leading-relaxed max-w-4xl text-gray-900">
                        {project.introduction}
                    </div>

                    <div className="intro-stagger mt-16 md:mt-auto pt-8 border-t border-gray-300 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
                        <div>
                            <span className="text-gray-400 text-xs tracking-widest uppercase mb-2 block">Category</span>
                            <span className="font-medium text-lg">{project.category}</span>
                        </div>
                        <div>
                            <span className="text-gray-400 text-xs tracking-widest uppercase mb-2 block">Year</span>
                            <span className="font-medium text-lg">{year}</span>
                        </div>
                        {techList.length > 0 && (
                            <div className="col-span-2">
                                <span className="text-gray-400 text-xs tracking-widest uppercase mb-3 block">Tech Stack</span>
                                <div className="flex flex-wrap gap-2">
                                    {techList.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-3 py-1 border border-black/[0.06] text-sm font-medium rounded-full"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {(project.demo_link || project.code_link) && (
                        <div className="intro-stagger mt-8 flex gap-4">
                            {project.demo_link && project.demo_link !== '#' && (
                                <a
                                    href={project.demo_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF2800] text-white text-xs font-bold tracking-widest uppercase rounded-full hover:bg-black transition-colors duration-300"
                                >
                                    Live Demo
                                    <svg className="w-3.5 h-3.5 -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16m0 0l-6-6m6 6l-6 6" />
                                    </svg>
                                </a>
                            )}
                            {project.code_link && project.code_link !== '#' && (
                                <a
                                    href={project.code_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 border border-black/10 text-[#1a1a1a] text-xs font-bold tracking-widest uppercase rounded-full hover:border-[#FF2800] hover:text-[#FF2800] transition-colors duration-300"
                                >
                                    Source Code
                                </a>
                            )}
                        </div>
                    )}
                </div>

                {(() => {
                    const storyBlocks: { title: string; content: string }[] = [];
                    if (project.what_i_did) storyBlocks.push({ title: 'What I Did', content: project.what_i_did });
                    if (project.interesting_things) storyBlocks.push({ title: 'Things I Find Interesting', content: project.interesting_things });

                    const chunks = storyBlocks.length + 1;
                    const perChunk = Math.max(1, Math.floor(gallery.length / chunks));

                    const elements: React.ReactNode[] = [];
                    let imageIndex = 0;

                    for (let chunk = 0; chunk < chunks; chunk++) {
                        const isLastChunk = chunk === chunks - 1;
                        const count = isLastChunk ? gallery.length - imageIndex : Math.min(perChunk, gallery.length - imageIndex);

                        for (let i = 0; i < count; i++) {
                            const item = gallery[imageIndex];
                            if (!item) break;
                            elements.push(
                                <div key={`img-${imageIndex}`} className="w-[85vw] md:w-[65vw] shrink-0 h-screen relative overflow-hidden group shadow-2xl">
                                    {item.type === 'video' ? (
                                        <video src={item.url} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" autoPlay muted loop playsInline />
                                    ) : (
                                        <img src={item.url} alt={`${project.title} ${imageIndex + 1}`} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
                                    )}
                                </div>
                            );
                            imageIndex++;
                        }

                        if (chunk < storyBlocks.length) {
                            const story = storyBlocks[chunk];
                            elements.push(
                                <div key={`story-${chunk}`} className="w-[85vw] md:w-[40vw] shrink-0 h-full flex flex-col justify-center">
                                    <h3 className="text-[#FF2800] text-xs md:text-sm tracking-widest uppercase font-bold mb-6">{story.title}</h3>
                                    <p className="text-lg md:text-xl leading-loose text-gray-800 serif-font">{story.content}</p>
                                </div>
                            );
                        }
                    }
                    return elements;
                })()}

                <div className="w-[90vw] md:w-[60vw] shrink-0 h-full flex flex-col justify-center pr-12 md:pr-24">
                    <h2 className="serif-font text-3xl md:text-5xl text-gray-300 mb-12 italic">More Projects</h2>
                    {otherProjects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {otherProjects.slice(0, 4).map((p) => {
                                const img = p.media?.[0]?.type === 'image' ? p.media[0].url : p.src;
                                return (
                                    <Link key={p.id} href={`/work/${p.slug}`} className="group block overflow-hidden rounded-xl border border-black/5 hover:border-[#FF2800]/30 transition-all duration-300 bg-white hover:shadow-xl">
                                        <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                                            {img ? <img src={img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /> : (
                                                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                                    <span className="serif-font text-gray-300 text-2xl italic">{p.title[0]}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-5">
                                            <span className="text-[10px] font-bold tracking-widest uppercase text-[#FF2800]">{p.category}</span>
                                            <h3 className="mt-2 text-lg serif-font font-bold text-[#1a1a1a] group-hover:text-[#FF2800] transition-colors leading-tight">{p.title}</h3>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : <p className="serif-font italic text-gray-400">No other projects yet.</p>}
                    <div className="mt-12">
                        <Link href="/work" className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-500 hover:text-[#FF2800] transition-colors">
                            View All Work
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16m0 0l-6-6m6 6l-6 6" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
