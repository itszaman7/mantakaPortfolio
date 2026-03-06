'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { Database, Code2, Paintbrush, Layers, Server, Zap, Globe, Blocks } from 'lucide-react';

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
                    clipPath: 'circle(12.5vw at 50% 35%)',
                    duration: 0.8,
                    ease: 'power3.inOut'
                }, 2.5);

                tl.to('#image-container', {
                    left: '50%',
                    top: '35%',
                    xPercent: -50,
                    yPercent: -50,
                    width: '25vw',
                    height: '25vw',
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
                    clipPath: 'circle(22.5vw at 50% 43%)',
                    duration: 0.8,
                    ease: 'power3.inOut'
                }, 2.5);

                tl.to('#image-container', {
                    left: '50%',
                    top: '43%',
                    xPercent: -50,
                    yPercent: -50,
                    width: '45vw',
                    height: '45vw',
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
                        <div id="selected-work-title" className="absolute bottom-[2vh] left-1/2 -translate-x-1/2 opacity-0 flex flex-col items-center pointer-events-none z-10 w-[95vw] lg:w-auto">
                            <h2 className="serif-font font-bold tracking-tighter text-[#1a1a1a] text-[15vw] md:text-[12vw] lg:text-[10vw] xl:text-[8.5vw] leading-[0.8] whitespace-nowrap">
                                Selected <span className="italic text-[#FF2800]">Work</span>
                            </h2>
                        </div>

                        {/* Left Side: Color Palette (Horizontal on mobile/tablet, Vertical on Desktop) */}
                        <div id="color-palette" className="absolute left-0 w-full lg:w-auto lg:left-[10vw] xl:left-[15vw] top-[10vh] lg:top-[50%] lg:-translate-y-1/2 opacity-0 flex flex-col items-center lg:items-start z-20 pointer-events-none">
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

                        {/* Right Side: Tech Stack (Horizontal on mobile/tablet, Vertical on Desktop) */}
                        <div id="tech-stack" className="absolute left-0 w-full lg:w-auto lg:left-auto lg:right-[5vw] xl:right-[10vw] top-[66vh] lg:top-[50%] lg:-translate-y-1/2 opacity-0 flex flex-col items-center lg:items-end z-20 pointer-events-none">
                            <span className="serif-font text-base lg:text-xl font-normal text-[#1a1a1a] mb-3 lg:mb-6 text-center lg:text-right w-full pointer-events-none">To Implementation</span>
                            <div className="relative w-[95vw] sm:w-[80vw] lg:w-64 flex flex-row flex-wrap justify-center gap-2 lg:block">
                                {/* Floating tech bubbles - Manually positioned to look scattered but grouped */}
                                <div className="static lg:absolute lg:top-0 lg:right-10 flex items-center gap-1.5 lg:gap-2 px-3 py-1.5 lg:px-4 lg:py-2 border border-black/10 rounded-full text-[10px] lg:text-xs font-semibold text-[#1a1a1a] bg-white/80 backdrop-blur-sm tech-bubble shadow-sm">
                                    <Globe size={14} className="text-[#1a1a1a]/70 w-3 h-3 lg:w-4 lg:h-4" /> Next.js
                                </div>
                                <div className="static lg:absolute lg:top-12 lg:right-36 flex items-center gap-1.5 lg:gap-2 px-3 py-1.5 lg:px-4 lg:py-2 border border-black/10 rounded-full text-[10px] lg:text-xs font-semibold text-[#1a1a1a] bg-white/80 backdrop-blur-sm tech-bubble shadow-sm">
                                    <Code2 size={14} className="text-[#1a1a1a]/70 w-3 h-3 lg:w-4 lg:h-4" /> React
                                </div>
                                <div className="static lg:absolute lg:top-24 lg:right-4 flex items-center gap-1.5 lg:gap-2 px-3 py-1.5 lg:px-4 lg:py-2 border border-black/10 rounded-full text-[10px] lg:text-xs font-semibold text-[#1a1a1a] bg-white/80 backdrop-blur-sm tech-bubble shadow-sm">
                                    <Paintbrush size={14} className="text-[#1a1a1a]/70 w-3 h-3 lg:w-4 lg:h-4" /> Tailwind CSS
                                </div>
                                <div className="static lg:absolute lg:top-36 lg:right-40 flex items-center gap-1.5 lg:gap-2 px-3 py-1.5 lg:px-4 lg:py-2 border border-black/10 rounded-full text-[10px] lg:text-xs font-semibold text-[#1a1a1a] bg-white/80 backdrop-blur-sm tech-bubble shadow-sm">
                                    <Server size={14} className="text-[#1a1a1a]/70 w-3 h-3 lg:w-4 lg:h-4" /> Django
                                </div>
                                <div className="static lg:absolute lg:top-48 lg:right-12 flex items-center gap-1.5 lg:gap-2 px-3 py-1.5 lg:px-4 lg:py-2 border border-black/10 rounded-full text-[10px] lg:text-xs font-semibold text-[#1a1a1a] bg-white/80 backdrop-blur-sm tech-bubble shadow-sm">
                                    <Blocks size={14} className="text-[#1a1a1a]/70 w-3 h-3 lg:w-4 lg:h-4" /> AWS
                                </div>
                                <div className="static lg:absolute lg:top-60 lg:right-32 flex items-center gap-1.5 lg:gap-2 px-3 py-1.5 lg:px-4 lg:py-2 border border-black/10 rounded-full text-[10px] lg:text-xs font-semibold text-[#1a1a1a] bg-white/80 backdrop-blur-sm tech-bubble shadow-sm">
                                    <Zap size={14} className="text-[#1a1a1a]/70 w-3 h-3 lg:w-4 lg:h-4" /> PyTorch
                                </div>
                                <div className="static lg:absolute lg:top-[18rem] lg:right-6 flex items-center gap-1.5 lg:gap-2 px-3 py-1.5 lg:px-4 lg:py-2 border border-black/10 rounded-full text-[10px] lg:text-xs font-semibold text-[#1a1a1a] bg-white/80 backdrop-blur-sm tech-bubble shadow-sm">
                                    <Database size={14} className="text-[#1a1a1a]/70 w-3 h-3 lg:w-4 lg:h-4" /> MySQL
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
                                    src="/2D_Assets/Hero Picture.JPG"
                                    alt="Portrait"
                                    className="hero-img absolute inset-0 w-full h-full object-cover scale-110 origin-center"
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
