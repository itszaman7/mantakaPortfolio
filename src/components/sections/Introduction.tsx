"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register ScrollTrigger
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const Introduction = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Target Mask Heights (Top-down masking reveals bottom-up video)
    // 60% mask = 40% reveal
    // 30% mask = 70% reveal
    // 0% mask = 100% reveal
    const targetMaskHeights = ["60%", "30%", "0%"];

    useGSAP(() => {
        const masks = gsap.utils.toArray(".bar-mask");
        const highlights = gsap.utils.toArray(".highlight");

        // --- 1. MASK ANIMATION (Staircase Reveal) ---
        gsap.set(masks, { height: "100%" }); // Start fully masked (white)
        gsap.to(masks, {
            height: (i: number) => targetMaskHeights[i],
            duration: 1.5,
            stagger: 0.2,
            ease: "power3.inOut",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 75%",
                toggleActions: "play none none reverse",
            },
        });

        // --- 2. TEXT HIGHLIGHT ANIMATION ---
        highlights.forEach((el) => {
            gsap.set(el, {
                backgroundSize: "0% 100%",
                backgroundImage: "linear-gradient(#ef4444, #ef4444)",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "left center",
                color: "#1f2937", // text-gray-800
                display: "inline", // Crucial for box-decoration-break
            });

            gsap.to(el, {
                backgroundSize: "100% 100%",
                color: "#ffffff",
                duration: 0.15, // Immediate/Snappy
                ease: "power1.out",
                scrollTrigger: {
                    trigger: el as Element,
                    start: "top 70%", // Triggers slightly lower down the screen
                    end: "bottom 20%",
                    toggleActions: "play reverse play reverse", // Snaps back on reverse
                }
            });
        });

        // --- 3. VIDEO HOVER ANIMATION (Scale + Overlay Opacity) ---
        const videoContainer = containerRef.current;
        if (videoContainer) {
            const overlay = gsap.utils.toArray(".video-overlay");
            const aboutText = gsap.utils.toArray(".about-text");
            // Target the single video element
            const video = gsap.utils.toArray(".main-video");

            const tl = gsap.timeline({ paused: true });

            // Smooth Scale + Dim Effect on Single Video
            tl.to(video, {
                scale: 1.05, // Subtle zoom
                duration: 0.8, // Slow and smooth
                ease: "power2.out"
            }, 0)
                .to(overlay, {
                    opacity: 0.4, // Dim the video using overlay
                    duration: 0.4,
                    ease: "power2.out"
                }, 0)
                .to(aboutText, {
                    y: 0,
                    opacity: 1,
                    duration: 0.4,
                    ease: "power3.out"
                }, 0);

            videoContainer.addEventListener("mouseenter", () => tl.play());
            videoContainer.addEventListener("mouseleave", () => tl.reverse());

            return () => {
                videoContainer.removeEventListener("mouseenter", () => tl.play());
                videoContainer.removeEventListener("mouseleave", () => tl.reverse());
            };
        }

    }, { scope: sectionRef });

    return (
        <section
            ref={sectionRef}
            className="flex flex-col md:flex-row h-screen w-full bg-white overflow-hidden relative"
        >
            {/* Left Column (Sticky Quote) */}
            {/* Changed to flex-col with flex-grow to ensure ABOUT sits at bottom without overlap */}
            <div className="md:w-1/2 relative z-10 h-full flex flex-col justify-between">

                {/* Quote Container - flex-grow pushes it to take available space, centering content */}
                <div className="flex-grow flex items-center justify-center p-8 md:p-16 w-full">
                    <div className="max-w-xl relative z-20">
                        {/* Increased leading to prevent highlight collision */}
                        <blockquote className="font-space-grotesk text-3xl md:text-4xl lg:text-5xl font-medium leading-normal text-gray-800 relative z-20">
                            "Bridging the gap between <span className="highlight box-decoration-clone px-1 rounded-sm">intelligent AI</span> and <span className="highlight box-decoration-clone px-1 rounded-sm">dynamic web design</span>. I build high-performance, <span className="highlight box-decoration-clone px-1 rounded-sm">award-winning</span> solutions that transform data into intuitive, human-centric experiences."
                        </blockquote>
                    </div>
                </div>

                {/* ABOUT Text - Relative flow to ensure margin/no-overlap */}
                <div className="about-text w-full opacity-0 translate-y-[30px] z-10 pointer-events-none mix-blend-difference md:mix-blend-normal drop-shadow-2xl relative">
                    {/* Use flex justify-between to force edge-to-edge alignment */}
                    <h2 className="flex justify-between w-full font-black tracking-tighter text-black leading-[0.75] translate-y-[10%]">
                        {/* Dynamic sizing based on viewport width to fill container roughly 50vw */}
                        <span className="text-[13.5vw]">A</span>
                        <span className="text-[13.5vw]">B</span>
                        <span className="text-[13.5vw]">O</span>
                        <span className="text-[13.5vw]">U</span>
                        <span className="text-[13.5vw]">T</span>
                    </h2>
                </div>
            </div>

            {/* Right Column (Single Video with Masks) */}
            <div
                ref={containerRef}
                className="md:w-1/2 h-full relative cursor-pointer video-hover-container overflow-hidden bg-white"
            >
                {/* 1. Underlying Video (Full Coverage) */}
                <div className="absolute inset-0 w-full h-full">
                    <video
                        src="/video/PXL_20260107_064510258.LS.mp4"
                        className="main-video w-full h-full object-cover transition-transform will-change-transform"
                        autoPlay
                        muted
                        loop
                        playsInline
                    />
                    {/* Overlay for Dimming */}
                    <div className="video-overlay absolute inset-0 bg-black opacity-0 pointer-events-none" />
                </div>

                {/* 2. Masks (White Bars on Top) */}
                <div className="absolute inset-0 flex flex-row z-10 pointer-events-none">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="bar-mask w-1/3 bg-white origin-top"
                            style={{ height: "100%" }} // Starts full height (hiding video)
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Introduction;
