'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { Share2 } from 'lucide-react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function EditorialHero() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        // ─── Lenis Smooth Scroll ───
        let lenis: any = null;
        const initLenis = async () => {
            try {
                const Lenis = (await import('lenis')).default;
                lenis = new Lenis({
                    duration: 1.2,
                    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    smoothWheel: true,
                    touchMultiplier: 2,
                });

                lenis.on('scroll', ScrollTrigger.update);
                gsap.ticker.add((time) => { lenis.raf(time * 1000); });
                gsap.ticker.lagSmoothing(0);
            } catch {
                // Lenis not installed — graceful fallback
            }
        };
        initLenis();
        // ─── Lenis Smooth Scroll ───
        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();

            // Desktop
            mm.add('(min-width: 768px)', () => {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: '#scroll-container',
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 1,
                    }
                });

                // Phase 1: Intro (Slower)
                tl.to('#hero-text', { y: '-120vh', duration: 2.0, ease: 'power2.inOut' }, 0);
                tl.to('#image-container', { left: '4vw', top: '4vh', width: '42vw', height: '92vh', borderRadius: '0%', duration: 2.0, ease: 'power3.inOut' }, 0);
                tl.to('.hero-img', { scale: 1, duration: 2.0, ease: 'power3.inOut' }, 0);
                tl.to('#about-content', { opacity: 1, y: 0, pointerEvents: 'auto', duration: 1.0, ease: 'power2.out' }, 1.0);

                // Phase 2: Shrink to Center Circle (Faster)
                tl.to('#about-content', { opacity: 0, pointerEvents: 'none', duration: 0.5, ease: 'power2.inOut' }, 2.3);

                tl.to('#hero-mask', {
                    clipPath: 'circle(12.5vw at 50% 40vh)',
                    duration: 0.8,
                    ease: 'power3.inOut'
                }, 2.5);

                tl.to('#image-container', {
                    left: '50%',
                    top: '40vh',
                    xPercent: -50,
                    yPercent: -50,
                    width: '25vw',
                    height: '25vw',
                    borderRadius: '50%',
                    duration: 0.8,
                    ease: 'power3.inOut'
                }, 2.5);

                tl.to('#hero-img-secondary', {
                    opacity: 1,
                    duration: 0.6,
                    ease: 'power2.inOut'
                }, 2.6);

                // Phase 3: Reveal Selected Work Text & Side Elements
                tl.fromTo('#selected-work-title',
                    { opacity: 0, y: '20vh', scale: 0.85, xPercent: -50 },
                    { opacity: 1, y: 0, scale: 1, xPercent: -50, duration: 1.2, ease: 'back.out(1)' },
                    2.8
                );

                tl.fromTo('#color-palette',
                    { opacity: 0, x: -50 },
                    { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' },
                    2.9
                );

                tl.fromTo('#tech-stack',
                    { opacity: 0, x: 50 },
                    { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' },
                    2.9
                );

                tl.fromTo('.tech-bubble',
                    { opacity: 0, scale: 0, y: 20 },
                    { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(1.5)' },
                    3.1
                );
            });

            // Mobile
            mm.add('(max-width: 767px)', () => {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: '#scroll-container',
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 1,
                    }
                });

                // Phase 1: Intro (Slower)
                tl.to('#hero-text', { y: '-120vh', duration: 2.0, ease: 'power2.inOut' }, 0);
                tl.to('#image-container', { left: '4vw', top: '10vh', width: '92vw', height: '45vh', borderRadius: '0%', duration: 2.0, ease: 'power3.inOut' }, 0);
                tl.to('.hero-img', { scale: 1, duration: 2.0, ease: 'power3.inOut' }, 0);
                tl.to('#about-content', { opacity: 1, y: 0, pointerEvents: 'auto', duration: 1.0, ease: 'power2.out' }, 1.0);

                // Phase 2: Shrink to Center Circle & change bg color (Faster)
                tl.to('#about-content', { opacity: 0, pointerEvents: 'none', duration: 0.5, ease: 'power2.inOut' }, 2.3);

                tl.to('#hero-mask', {
                    clipPath: 'circle(22.5vw at 50% 43vh)',
                    duration: 0.8,
                    ease: 'power3.inOut'
                }, 2.5);

                tl.to('#image-container', {
                    left: '50%',
                    top: '43vh',
                    xPercent: -50,
                    yPercent: -50,
                    width: '45vw',
                    height: '45vw',
                    borderRadius: '50%',
                    duration: 0.8,
                    ease: 'power3.inOut'
                }, 2.5);

                tl.to('#hero-img-secondary', {
                    opacity: 1,
                    duration: 0.6,
                    ease: 'power2.inOut'
                }, 2.6);

                // Phase 3: Reveal Selected Work Text & Side Elements
                tl.fromTo('#selected-work-title',
                    { opacity: 0, y: '20vh', scale: 0.85, xPercent: -50 },
                    { opacity: 1, y: 0, scale: 1, xPercent: -50, duration: 1.2, ease: 'back.out(1)' },
                    2.8
                );

                tl.fromTo('#color-palette',
                    { opacity: 0, x: -30 },
                    { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' },
                    2.9
                );

                tl.fromTo('#tech-stack',
                    { opacity: 0, x: 30 },
                    { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' },
                    2.9
                );

                tl.fromTo('.tech-bubble',
                    { opacity: 0, scale: 0, y: 15 },
                    { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(1.5)' },
                    3.1
                );
            });

            // Mouse parallax on image
            const heroImg = document.querySelector('.hero-img') as HTMLElement;
            const parallaxMove = (e: MouseEvent) => {
                if (window.scrollY < 100 && heroImg) {
                    const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
                    const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
                    gsap.to(heroImg, { x: xAxis, y: yAxis, duration: 1, ease: 'power1.out' });
                }
            };
            document.addEventListener('mousemove', parallaxMove);

            return () => { document.removeEventListener('mousemove', parallaxMove); };
        }, sectionRef);

        return () => {
            ctx.revert();
            if (lenis) lenis.destroy();
        };
    }, []);

    return (
        <>
            <style jsx global>{`
                .image-wrapper {
                    clip-path: inset(0% 0% 0% 0%);
                    will-change: transform, width, height, left, top;
                }
                .hero-img { will-change: transform; }
                ::-webkit-scrollbar { width: 0px; background: transparent; }
            `}</style>

            <div ref={sectionRef}>

                {/* Main Scroll Container */}
                <main id="scroll-container" className="relative w-full h-[300vh]">
                    {/* Pinned Section */}
                    <div id="pinned-section" className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-[#FBFBFA]">

                        {/* Selected Work Title (Hidden initially, animates in Phase 3) */}
                        <div id="selected-work-title" className="absolute bottom-[2vh] lg:bottom-[1vh] left-1/2 -translate-x-1/2 opacity-0 flex flex-col items-center pointer-events-none z-10 w-full px-4">
                            <h2 className="serif-font font-bold tracking-tighter text-[#1a1a1a] text-[18vw] sm:text-[15vw] md:text-[12vw] lg:text-[10vw] xl:text-[8.5vw] leading-[0.8] md:whitespace-nowrap flex flex-col md:flex-row items-center gap-0 md:gap-4 lg:gap-6 justify-center">
                                <span>Selected</span> <span className="italic text-[#FF2800]">Work</span>
                            </h2>
                        </div>

                        {/* Left Side: Color Palette (Horizontal on mobile/tablet, Vertical on Desktop) */}
                        <div id="color-palette" className="absolute left-0 w-full lg:w-auto lg:left-[10vw] xl:left-[15vw] top-[10vh] lg:top-[28vh] opacity-0 flex flex-col items-center lg:items-start z-20 pointer-events-none">
                            <span className="serif-font text-base lg:text-xl font-normal text-[#1a1a1a] mb-2 lg:mb-3 pointer-events-none">From Design</span>
                            {/* Colorful rectangles with hex codes */}
                            <div className="flex flex-row lg:flex-col gap-4 lg:gap-3 justify-center">
                                {[
                                    { hex: '#FBFBFA', name: 'Background', border: true },
                                    { hex: '#1A1A1A', name: 'Primary Text', border: false },
                                    { hex: '#FF2800', name: 'Accent Red', border: false },
                                    { hex: '#EBEBEB', name: 'Light Gray', border: false },
                                ].map((color, i) => (
                                    <div key={i} className="flex flex-col items-center lg:items-start gap-1 mb-0 lg:mb-2 text-center lg:text-left">
                                        <div className={`w-10 h-14 md:w-16 md:h-16 lg:w-16 lg:h-20 2xl:w-20 2xl:h-24 rounded shadow-sm ${color.border ? 'border border-black/10' : ''}`} style={{ backgroundColor: color.hex }}></div>
                                        <span className="text-[9px] lg:text-[9px] uppercase tracking-wider text-[#1a1a1a] font-medium mt-1">{color.hex}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Side: Tech Stack */}
                        <div id="tech-stack" className="absolute left-0 w-full lg:w-auto lg:left-auto lg:right-[5vw] xl:right-[8vw] top-[66vh] lg:top-[28vh] opacity-0 flex flex-col items-center lg:items-end z-20 pointer-events-none">
                            <span className="serif-font text-base lg:text-xl font-normal text-[#1a1a1a] mb-3 lg:mb-8 text-center lg:text-right w-full pointer-events-none">To Implementation</span>
                            <div className="relative w-[95vw] sm:w-[80vw] lg:w-64 flex flex-row flex-wrap justify-center gap-2 lg:block">
                                {/* Floating tech bubbles - Staggered layout with proper icons */}
                                <div className="static lg:absolute lg:top-0 lg:right-4 flex items-center gap-2 px-4 py-2 border border-black/10 rounded-xl text-[10px] lg:text-xs font-bold text-[#1a1a1a] bg-white/80 backdrop-blur-sm tech-bubble shadow-sm">
                                    <svg width="14" height="14" viewBox="0 0 128 128"><path d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64c11.2 0 21.7-2.9 30.8-7.9L48.4 55.4v33.2h-7.8V40.2h7.8l56.3 75.8c9-12.7 14.3-28.2 14.3-45C128 28.7 99.3 0 64 0zm25.1 40.2h7.8v22.4l-7.8-10.5V40.2z" fill="currentColor" /></svg>
                                    Next.js
                                </div>
                                <div className="static lg:absolute lg:top-14 lg:right-28 flex items-center gap-2 px-4 py-2 border border-black/10 rounded-xl text-[10px] lg:text-xs font-bold text-[#1a1a1a] bg-white/80 backdrop-blur-sm tech-bubble shadow-sm">
                                    <svg width="14" height="14" viewBox="0 0 128 128"><path d="M117.5 53.5c.6-1.5.9-3.1.9-4.7 0-7.3-5.9-13.2-13.2-13.2-3.1 0-6 .1-8.6.3C87.4 20.3 76.5 11 64 11s-23.4 9.3-32.6 24.9c-2.6-.2-5.5-.3-8.6-.3-7.3 0-13.2 5.9-13.2 13.2 0 1.6.3 3.2.9 4.7-5.5 8.1-8.7 18.1-8.7 29.1 0 27.2 22.1 49.3 49.3 49.3s49.3-22.1 49.3-49.3c.1-11-3.1-21-8.6-29.1zM64 114.7c-21.7 0-39.3-17.6-39.3-39.4 0-5.7 1.2-11.2 3.4-16.1 1.4-3.3 2.8-5.9 4.3-8.1 4.2-6.1 12-14.4 20.1-20.7 4.1-3.2 8.4-5.3 11.5-6.5C64 24 64 114.7 64 114.7zm39.3-39.4c0 21.7-17.6 39.3-39.3 39.3V24c3.1 1.2 7.4 3.3 11.5 6.5 8.1 6.3 16 14.6 20.1 20.7 1.5 2.2 2.9 4.8 4.3 8.1 2.2 4.9 3.4 10.4 3.4 16.1v.1z" fill="#61DAFB" /></svg>
                                    React
                                </div>
                                <div className="static lg:absolute lg:top-28 lg:right-2 flex items-center gap-2 px-4 py-2 border border-black/10 rounded-xl text-[10px] lg:text-xs font-bold text-[#1a1a1a] bg-white/80 backdrop-blur-sm tech-bubble shadow-sm">
                                    <svg width="14" height="14" viewBox="0 0 128 128"><path d="M64 33.1L32 0H0l48 48 16 16 16-16 48-48H96L64 33.1zM0 128l48-48 16-16 16 16 48 48H96l-32-33.1L32 128H0z" fill="#06B6D4" /></svg>
                                    Tailwind CSS
                                </div>
                                <div className="static lg:absolute lg:top-42 lg:right-32 flex items-center gap-2 px-4 py-2 border border-black/10 rounded-xl text-[10px] lg:text-xs font-bold text-[#1a1a1a] bg-white/80 backdrop-blur-sm tech-bubble shadow-sm">
                                    <svg width="14" height="14" viewBox="0 0 128 128"><path d="M72.2 0H55.8v45.1L12.5 15.6l-8.2 14.2 43.3 29.5L4.3 88.8l8.2 14.2 43.3-29.5v45.1h16.4V73.5l43.3 29.5 8.2-14.2-43.3-29.5L123.7 29.8l-8.2-14.2-43.3 29.5V0z" fill="#092E20" /></svg>
                                    Django
                                </div>
                                <div className="static lg:absolute lg:top-56 lg:right-8 flex items-center gap-2 px-4 py-2 border border-black/10 rounded-xl text-[10px] lg:text-xs font-bold text-[#1a1a1a] bg-white/80 backdrop-blur-sm tech-bubble shadow-sm">
                                    <svg width="14" height="14" viewBox="0 0 128 128"><path d="M125 76c.4-3.5.5-7.1.6-10.7-.1-3.6-.2-7.2-.6-10.7-1.1-10.7-4.4-21-9.9-30.2-5.5-9.2-12.8-17.1-21.5-23.2-8.7-6.1-18.7-10.1-29.3-11.7C53.7-2.1 43 .2 33.1 4.5 23.2 8.8 14.6 15.3 8 23.6 1.4 31.9-2.5 42-3.4 52.6-1.1 63.2 1.9 73.4 7.4 82.5c5.5 9.1 12.8 16.9 21.5 23 8.7 6.1 18.7 10 29.3 11.6 10.6 1.6 21.4-.7 31.2-5 9.8-4.3 18.4-10.8 25.1-19.1 6.7-8.3 10.6-18.4 11.5-29H125zm-22.1 7.2c-5.7 7-13.1 12.3-21.6 15.5-8.5 3.2-17.7 4.1-26.7 2.6-9-.9-17.6-4.5-24.8-10.3-7.2-5.7-12.7-13.2-16-21.7-3.3-8.5-4.3-17.8-2.9-26.8 1.4-9 5.3-17.4 11.2-24.4 5.9-7 13.5-12.3 22.1-15.4 8.6-3.1 17.9-3.9 27-2.3 9.1 1.6 17.6 5.3 24.8 11.1s12.6 13.4 15.7 22l-1.9 4.3c-2.4-7-6.6-13.3-12.3-18.3-5.7-5-12.4-8.4-19.8-10.1-7.4-1.7-15.1-1.4-22.3 1s-13.6 6.5-18.4 12.1c-4.8 5.6-8.1 12.4-9.6 19.8-1.5 7.4-1 15 1.5 22.1 2.5 7.1 6.8 13.4 12.6 18.2s12.6 8 19.9 9.3c7.3 1.3 14.8.8 21.9-1.5 7.1-2.3 13.4-6.3 18.3-11.5l1.3 4z" fill="#FF9900" /></svg>
                                    AWS
                                </div>
                                <div className="static lg:absolute lg:top-70 lg:right-36 flex items-center gap-2 px-4 py-2 border border-black/10 rounded-xl text-[10px] lg:text-xs font-bold text-[#1a1a1a] bg-white/80 backdrop-blur-sm tech-bubble shadow-sm">
                                    <svg width="14" height="14" viewBox="0 0 128 128"><path d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64 64-28.7 64-64S99.3 0 64 0zm0 119.3c-30.5 0-55.3-24.8-55.3-55.3S33.5 8.7 64 8.7s55.3 24.8 55.3 55.3-24.8 55.3-55.3 55.3zm.4-106.6c-28.3 0-51.3 23-51.3 51.3s23 51.3 51.3 51.3c28.3 0 51.3-23 51.3-51.3s-23-51.3-51.3-51.3zm1.1 91.5l-20-41.1h15.8l10.2 23.3 10.3-23.3H98l-20 41.1h-12.5z" fill="#EE4C2C" /></svg>
                                    PyTorch
                                </div>
                                <div className="static lg:absolute lg:top-[21.5rem] lg:right-10 flex items-center gap-2 px-4 py-2 border border-black/10 rounded-xl text-[10px] lg:text-xs font-bold text-[#1a1a1a] bg-white/80 backdrop-blur-sm tech-bubble shadow-sm">
                                    <svg width="14" height="14" viewBox="0 0 128 128"><path d="M64 4.5c20.3 0 36.8 6.4 36.8 14.2s-16.5 14.2-36.8 14.2-36.8-6.4-36.8-14.2S43.7 4.5 64 4.5zM27.2 28.7c-5.8 4.4-8.8 8.8-8.8 13.3v13c0 7.8 16.5 14.2 36.8 14.2s36.8-6.4 36.8-14.2v-13c0-4.4-2.9-8.9-8.8-13.3 4 1.7 6 3.9 6 6.3s-16.5 14.2-36.8 14.2-36.8-6.4-36.8-14.2c0-2.4 2.1-4.7 6-6.3zM27.2 55c-5.8 4.4-8.8 8.8-8.8 13.3v13c0 7.8 16.5 14.2 36.8 14.2s36.8-6.4 36.8-14.2v-13c0-4.4-2.9-8.9-8.8-13.3 4 1.7 6 3.9 6 6.3s-16.5 14.2-36.8 14.2-36.8-6.4-36.8-14.2c0-2.4 2.1-4.7 6-6.3zM27.2 81.3c-5.8 4.4-8.8 8.9-8.8 13.3v13c0 7.8 16.5 14.2 36.8 14.2s36.8-6.4 36.8-14.2v-13c0-4.4-2.9-8.8-8.8-13.3 4 1.7 6 3.9 6 6.3s-16.5 14.2-36.8 14.2-36.8-6.4-36.8-14.2c0-2.4 2.1-4.6 6-6.3z" fill="#4479A1" /></svg>
                                    MySQL
                                </div>
                            </div>
                        </div>

                        {/* Hero Mask Wrapper - Translates into a circle on scroll */}
                        <div id="hero-mask" className="absolute inset-0 w-full h-full bg-white z-10" style={{ clipPath: 'circle(150vw at 50% 50%)' }}>
                            {/* Portrait Image — your actual picture */}
                            <div
                                id="image-container"
                                className="image-wrapper absolute z-10 w-[50vw] h-[40vh] md:w-[26vw] md:h-[55vh] top-[25vh] md:top-[22vh] left-[10vw] md:left-[14vw] overflow-hidden"
                            >
                                <img
                                    src="/2D_Assets/Hero%20Picture.JPG"
                                    alt="Portrait"
                                    className="hero-img absolute inset-0 w-full h-full object-cover origin-center"
                                />
                                <img
                                    id="hero-img-secondary"
                                    src="/2D_Assets/me.jpg"
                                    alt="Me"
                                    className="hero-img absolute inset-0 w-full h-full object-cover scale-110 origin-center opacity-0"
                                />
                            </div>

                            {/* Giant Background Text — uses serif-font (Playfair Display) + #1a1a1a */}
                            <div id="hero-text" className="absolute bottom-0 left-0 w-full flex flex-col justify-end pointer-events-none z-20 pb-[1vh]">
                                <h1 className="text-[28vw] md:text-[32vw] serif-font font-normal text-[#1a1a1a] leading-[0.6] tracking-[-0.04em] whitespace-nowrap lowercase -ml-[4vw]">
                                    creative
                                </h1>
                                <h2 className="text-[16vw] md:text-[14vw] serif-font italic text-[#FF2800] leading-[0.75] tracking-[-0.02em] ml-[20vw] md:ml-[35vw] lowercase mt-2 md:mt-4">
                                    developer
                                </h2>
                            </div>

                            {/* About Content (animates in) */}
                            <div id="about-content" className="absolute right-0 top-0 w-full md:w-1/2 h-full flex flex-col justify-between p-8 md:py-16 md:px-16 opacity-0 z-30 pointer-events-none">
                                {/* Top labels */}
                                <div className="flex justify-between w-full mt-16 md:mt-6">
                                    <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#1a1a1a]/40">Identity &amp; Code</span>
                                    <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#1a1a1a]/40 text-right">Turning logic into<br />visual worlds</span>
                                </div>

                                {/* Main Content */}
                                <div className="mb-16 md:mb-20 w-full md:w-[90%]">
                                    <h3 className="serif-font text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-[#1a1a1a] mb-8">
                                        Every idea deserves<br />
                                        to feel <span className="italic text-[#FF2800]">alive.</span>
                                    </h3>
                                    <p className="text-base md:text-lg font-light text-[#1a1a1a]/60 leading-[1.8] tracking-wide max-w-lg">
                                        I turn what you&apos;re imagining into code, colours, and shapes that resonate — creating digital worlds that both move and inspire.
                                    </p>
                                </div>
                            </div>

                            {/* End Hero Mask Wrapper */}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
