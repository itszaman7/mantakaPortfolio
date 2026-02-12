"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const HeroScroll = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const marqueeRow1Ref = useRef<HTMLDivElement>(null);
    const marqueeRow2Ref = useRef<HTMLDivElement>(null);
    const maskRefs = useRef<(HTMLDivElement | null)[]>([]);
    const textRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const marqueeWrapperRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const stripe1Ref = useRef<HTMLDivElement>(null);
    const stripe2Ref = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const container = containerRef.current;
        const card = cardRef.current;
        const row1 = marqueeRow1Ref.current;
        const row2 = marqueeRow2Ref.current;
        const masks = maskRefs.current;
        // Scope highlights to only this component's container
        const highlights = container ? gsap.utils.toArray(".highlight", container) : [];
        const overlay = overlayRef.current;
        const marqueeWrapper = marqueeWrapperRef.current;
        const text = textRef.current;
        const video = videoRef.current;
        const stripe1 = stripe1Ref.current;
        const stripe2 = stripe2Ref.current;

        if (!container || !card || !row1 || !row2) return;

        // Ensure video plays when section enters viewport
        if (video) {
            ScrollTrigger.create({
                trigger: container,
                start: "top bottom",
                onEnter: () => {
                    // Ensure video plays when section enters viewport
                    video.play().catch(() => {
                        // Handle autoplay restrictions silently
                    });
                }
            });
        }

        // --- MASTER TIMELINE ---
        // This handles all scroll-linked animations in one place for perfect sync
        // --- 1. SHRINK ANIMATION (Scroll-Linked) ---
        const scrollTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
            }
        });

        scrollTimeline.to(card, {
            scale: 0.6,
            borderRadius: 0, // Remove rounding
            ease: "none",
            duration: 1
        }, 0);

        if (overlay) {
            scrollTimeline.to(overlay, {
                opacity: 0.6,
                ease: "none",
                duration: 1
            }, 0);
        }

        // --- 1.B MARQUEE ANIMATION (Scroll-Linked) ---
        // Slide stripes in from sides
        if (stripe1 && stripe2) {
            // Stripe 1 (Top-Left to Bottom-Right) - Slide from LEFT
            scrollTimeline.fromTo(stripe1,
                { xPercent: -120, opacity: 0 },
                {
                    xPercent: 0,
                    opacity: 1,
                    ease: "power2.out",
                    duration: 0.8
                }, 0.2
            );

            // Stripe 2 (Bottom-Left to Top-Right) - Slide from RIGHT
            scrollTimeline.fromTo(stripe2,
                { xPercent: 120, opacity: 0 },
                {
                    xPercent: 0,
                    opacity: 1,
                    ease: "power2.out",
                    duration: 0.8
                }, 0.2
            );
        }

        // --- 2. ENTRY ANIMATION (Text & Video Reveal) ---
        // Triggers as soon as the section enters the viewport
        const entryTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start: "top 60%", // Start when top of container hits 60% of viewport height
                toggleActions: "play none none reverse"
            }
        });

        // A. Reveal Text (ABOUT)
        if (text) {
            entryTimeline.to(text, {
                yPercent: 0,
                opacity: 1,
                autoAlpha: 1,
                ease: "power2.out",
                duration: 0.8
            }, 0); // Start immediately
        }

        // B. Animate Masks (Reveal Video)
        if (masks.length > 0) {
            const targetMaskHeights = ["60%", "30%", "0%"];
            masks.forEach((mask, i) => {
                if (mask) {
                    entryTimeline.to(mask, {
                        height: targetMaskHeights[i],
                        ease: "power2.inOut",
                        duration: 1.2
                    }, 0 + (i * 0.1)); // Start with text, staggered
                }
            });
        }

        // --- MARQUEE: Horizontal scroll (moving text), many copies so stripe is never empty ---
        if (row1 && row2) {
            gsap.to(row1, {
                xPercent: -50,
                ease: "none",
                duration: 20,
                repeat: -1,
            });
            gsap.fromTo(row2,
                { xPercent: -50 },
                {
                    xPercent: 0,
                    ease: "none",
                    duration: 20,
                    repeat: -1,
                }
            );
        }

        // Highlight Text Animation - Trigger when section enters viewport
        highlights.forEach((el) => {
            gsap.fromTo(el as Element,
                {
                    backgroundSize: "0% 100%",
                    backgroundPosition: "0% 100%"
                },
                {
                    backgroundSize: "100% 100%",
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: el as Element,
                        start: "top 90%", // Trigger early when entering viewport
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

    }, { scope: containerRef });

    return (
        // KEY CHANGE 1: Increased height to 350vh.
        // This gives you 250vh of "scroll distance" to play the animation.
        <div ref={containerRef} className="relative h-[350vh] bg-[#f4f4f5]">

            {/* Sticky Wrapper */}
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center perspective-1000">

                {/* --- BACKGROUND GRID --- */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    {/* Single grid layer - no blur to avoid render glitches; height for seamless scroll */}
                    <div
                        className="absolute top-0 left-0 right-0 w-full h-[calc(100%+80px)] bg-[linear-gradient(rgba(239,68,68,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.25)_1px,transparent_1px)] bg-[length:40px_40px] [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] animate-grid-flow"
                        style={{ willChange: "transform", backfaceVisibility: "hidden" }}
                    />
                </div>

                {/* --- CARD --- */}
                <div
                    ref={cardRef}
                    // Removed 'will-change-transform' from className to let GSAP handle it (optional)
                    className="relative w-full h-full bg-[#f4f4f5] z-10 overflow-hidden shadow-2xl origin-center flex flex-col md:flex-row border border-gray-100"
                    style={{ borderRadius: 0 }}
                >
                    {/* Darkening Overlay */}
                    <div ref={overlayRef} className="absolute inset-0 bg-black z-50 pointer-events-none opacity-0"></div>

                    {/* Left Column */}
                    <div className="md:w-1/2 relative z-10 h-full flex flex-col justify-center p-6 sm:p-8 md:p-16 lg:p-24 pb-24 sm:pb-32 overflow-hidden">
                        <div className="max-w-xl relative z-20">
                            <h3 className="anim-text font-sans text-xs sm:text-sm font-bold tracking-widest text-red-500 uppercase mb-4 sm:mb-6">
                                Bridging The Gap
                            </h3>

                            <div className="font-sans text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-medium leading-[1.1] text-gray-900 tracking-tight">
                                <div className="anim-text mb-1 sm:mb-2">
                                    Between <span className="highlight box-decoration-clone inline-block px-1 bg-gradient-to-r from-red-600 to-red-600 bg-no-repeat text-white">intelligent AI</span>
                                </div>
                                <div className="anim-text mb-6 sm:mb-8">
                                    and <span className="highlight box-decoration-clone inline-block px-1 bg-gradient-to-r from-red-600 to-red-600 bg-no-repeat text-white">dynamic design.</span>
                                </div>

                                <p className="anim-text text-base sm:text-xl md:text-2xl text-gray-600 font-normal leading-relaxed max-w-lg">
                                    I build high-performance, <span className="font-bold text-black border-b-2 border-red-500">award-winning</span> solutions.
                                </p>
                            </div>
                        </div>

                        <div
                            ref={textRef}
                            className="about-text w-full z-10 pointer-events-none mix-blend-normal absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-8 opacity-10 select-none overflow-hidden"
                        >
                            <h2 className="flex justify-between w-full font-black tracking-tighter text-gray-900 leading-none min-w-0">
                                {"ABOUT".split("").map((char, i) => (
                                    <span key={i} className="text-[14vw] sm:text-[11vw] md:text-[6rem] lg:text-[10rem] xl:text-[14rem] shrink-0">{char}</span>
                                ))}
                            </h2>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="md:w-1/2 min-h-[40vh] md:min-h-0 h-full relative overflow-hidden bg-[#f4f4f5]">
                        <div className="absolute inset-0 w-full h-full">
                            <video
                                ref={videoRef}
                                src="/video/PXL_20260107_064510258.LS.mp4"
                                className="main-video w-full h-full object-cover"
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="auto"
                            />
                        </div>
                        <div className="absolute inset-0 flex flex-row z-10 pointer-events-none">
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    ref={(el) => { maskRefs.current[i] = el; }}
                                    className="bar-mask w-1/3 bg-[#f4f4f5] origin-top"
                                    style={{ height: "100%" }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- FRONT LAYER: MARQUEE --- */}
                {/* Horizontal moving text; centered in stripe; many copies so never empty */}
                <div ref={marqueeWrapperRef} className="absolute inset-0 flex justify-center items-center z-40 pointer-events-none overflow-hidden">
                    <div ref={stripe1Ref} className="absolute bg-[#111] py-2 sm:py-3 md:py-5 lg:py-6 w-[200vw] flex justify-center items-center transform rotate-[15deg] shadow-lg border-y border-gray-800 opacity-0 overflow-hidden">
                        <div ref={marqueeRow1Ref} className="flex whitespace-nowrap w-max opacity-90 items-center justify-center">
                            {[...Array(16)].map((_, i) => (
                                <span key={i} className="font-sans font-bold text-[2.5vw] sm:text-[3vw] md:text-[4vw] leading-none text-white mr-4 sm:mr-8 md:mr-12 tracking-wider inline-flex items-center shrink-0">
                                    AGENTIC AI RESEARCHER <span className="text-red-500 mx-2 md:mx-4 text-xl md:text-4xl">■</span>
                                </span>
                            ))}
                        </div>
                    </div>
                    <div ref={stripe2Ref} className="absolute bg-[#111] py-2 sm:py-3 md:py-5 lg:py-6 w-[200vw] flex justify-center items-center transform -rotate-[15deg] shadow-lg border-y border-gray-800 opacity-0 overflow-hidden">
                        <div ref={marqueeRow2Ref} className="flex whitespace-nowrap w-max opacity-90 items-center justify-center">
                            {[...Array(16)].map((_, i) => (
                                <span key={i} className="font-sans font-bold text-[2.5vw] sm:text-[3vw] md:text-[4vw] leading-none text-white mr-4 sm:mr-8 md:mr-12 tracking-wider inline-flex items-center shrink-0">
                                    PYTHON <span className="text-red-500 mx-2 md:mx-4 text-xl md:text-4xl">■</span> NEXT.JS <span className="text-red-500 mx-2 md:mx-4 text-xl md:text-4xl">■</span>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
                @keyframes grid-flow {
                    0% { transform: translate3d(0, 0, 0); }
                    100% { transform: translate3d(0, -40px, 0); }
                }
                .animate-grid-flow {
                    animation: grid-flow 3s linear infinite;
                    transform: translate3d(0, 0, 0);
                }
            `}</style>
        </div>
    );
};

export default HeroScroll;