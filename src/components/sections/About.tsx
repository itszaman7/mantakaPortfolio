"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register ScrollTrigger
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const About = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Target Mask Heights (Top-down masking reveals bottom-up video)
    const targetMaskHeights = ["60%", "30%", "0%"];

    useGSAP(() => {
        const section = sectionRef.current;
        if (!section) return;

        const masks = gsap.utils.toArray(".bar-mask", section);
        const textElements = gsap.utils.toArray(".anim-text", section);
        const aboutText = gsap.utils.toArray(".about-big-text span", section);
        const video = videoRef.current;

        // Ensure video plays when section enters viewport
        if (video) {
            ScrollTrigger.create({
                trigger: section,
                start: "top bottom",
                onEnter: () => {
                    video.play().catch(() => { });
                }
            });
        }

        // --- MASTER TIMELINE ---
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top 60%",
                toggleActions: "play none none reverse"
            }
        });

        // 1. Text Reveal (Staggered Fade Up)
        tl.fromTo(textElements,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out"
            }
        );

        // 2. "ABOUT" Big Text Reveal (Staggered Up)
        tl.fromTo(aboutText,
            { yPercent: 100, opacity: 0 },
            {
                yPercent: 0,
                opacity: 0.1, // Keep it subtle transparent
                duration: 1,
                stagger: 0.05,
                ease: "power3.out"
            }, "-=0.5"
        );

        // 3. Mask Animation (Video Reveal) - Runs parallel
        tl.to(masks, {
            height: (i: number) => targetMaskHeights[i],
            duration: 1.5,
            stagger: 0.2,
            ease: "power3.inOut"
        }, 0);

        // --- HIGHLIGHT ANIMATION (Separate Trigger for timing) ---
        const highlights = gsap.utils.toArray(".highlight", section);
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

        // --- VIDEO HOVER (Subtle Scale Only) ---
        const videoContainer = containerRef.current;
        if (videoContainer) {
            const hoverTl = gsap.timeline({ paused: true });
            const mainVideo = gsap.utils.toArray(".main-video", section);

            hoverTl.to(mainVideo, { scale: 1.05, duration: 0.5, ease: "power2.out" });

            videoContainer.addEventListener("mouseenter", () => hoverTl.play());
            videoContainer.addEventListener("mouseleave", () => hoverTl.reverse());

            return () => {
                videoContainer.removeEventListener("mouseenter", () => hoverTl.play());
                videoContainer.removeEventListener("mouseleave", () => hoverTl.reverse());
            };
        }

    }, { scope: sectionRef });

    return (
        <section
            ref={sectionRef}
            className="flex flex-col md:flex-row h-screen w-full bg-[#f4f4f5] overflow-hidden relative"
        >
            {/* Left Column (Text) */}
            <div className="md:w-1/2 relative z-10 h-full flex flex-col justify-center p-8 md:p-16 lg:p-24 pb-32">

                <div className="max-w-xl relative z-20">
                    <h3 className="anim-text font-space-grotesk text-sm font-bold tracking-widest text-red-500 uppercase mb-6">
                        Bridging The Gap
                    </h3>

                    <div className="font-space-grotesk text-4xl md:text-5xl lg:text-7xl font-medium leading-[1.1] text-gray-900 tracking-tight">
                        <div className="anim-text mb-2">
                            Between <span className="highlight box-decoration-clone inline-block px-1 bg-gradient-to-r from-red-600 to-red-600 bg-no-repeat text-white">intelligent AI</span>
                        </div>
                        <div className="anim-text mb-8">
                            and <span className="highlight box-decoration-clone inline-block px-1 bg-gradient-to-r from-red-600 to-red-600 bg-no-repeat text-white">dynamic design.</span>
                        </div>

                        <p className="anim-text text-xl md:text-2xl text-gray-600 font-normal leading-relaxed max-w-lg">
                            I build high-performance, <span className="font-bold text-black border-b-2 border-red-500">award-winning</span> solutions that transform data into intuitive, human-centric experiences.
                        </p>
                    </div>
                </div>

                {/* ABOUT Text - Fixed Positioning at Bottom Left */}
                <div className="absolute bottom-0 left-0 w-full pointer-events-none p-4 md:p-8 opacity-10 select-none">
                    <h2 className="about-big-text font-black tracking-tighter text-gray-900 leading-none">
                        {"ABOUT".split("").map((char, i) => (
                            <span key={i} className="text-[12rem] xl:text-[14rem] inline-block">{char}</span>
                        ))}
                    </h2>
                </div>
            </div>

            {/* Right Column (Video) */}
            <div
                ref={containerRef}
                className="md:w-1/2 h-full relative cursor-pointer video-hover-container overflow-hidden bg-white"
            >
                {/* Video */}
                <div className="absolute inset-0 w-full h-full">
                    <video
                        ref={videoRef}
                        src="/video/PXL_20260107_064510258.LS.mp4"
                        className="main-video w-full h-full object-cover transition-transform will-change-transform"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                    />
                </div>

                {/* Masks */}
                <div className="absolute inset-0 flex flex-row z-10 pointer-events-none">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="bar-mask w-1/3 bg-white origin-top"
                            style={{ height: "100%" }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default About;