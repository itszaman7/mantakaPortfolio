"use client";

import React, { useRef, useState } from 'react';
import type { Milestone } from "@/lib/milestonesData";
import { motion, useScroll, useSpring, useTransform, useMotionValue } from "framer-motion";

// Using Google Fonts for an elegant "Old Money" editorial look
const FontInjection = () => (
    <style>
        {`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');
      
      .font-playfair {
        font-family: 'Playfair Display', serif;
      }
      .font-sans {
        font-family: 'Inter', sans-serif;
      }
      
      /* Elegant, minimal scrollbar */
      ::-webkit-scrollbar {
        width: 6px;
      }
      ::-webkit-scrollbar-track {
        background: #fafafa;
      }
      ::-webkit-scrollbar-thumb {
        background: #e5e5e5;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #ff2800;
      }
    `}
    </style>
);

const MilestoneItem = ({ data, index }: { data: Milestone; index: number }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHoveringGallery, setIsHoveringGallery] = useState(false);
    const [cursorDirection, setCursorDirection] = useState<'left' | 'right'>('right');
    const containerRef = useRef<HTMLDivElement>(null);

    // Smooth physics-based custom cursor values
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const cursorX = useSpring(mouseX, { stiffness: 400, damping: 28 });
    const cursorY = useSpring(mouseY, { stiffness: 400, damping: 28 });

    const nextImage = () => {
        if (data.images && data.images.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % data.images.length);
        }
    };

    const prevImage = () => {
        if (data.images && data.images.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + data.images.length) % data.images.length);
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        mouseX.set(x);
        mouseY.set(y);

        if (x < rect.width / 2) {
            setCursorDirection('left');
        } else {
            setCursorDirection('right');
        }
    };

    const handleGalleryClick = () => {
        if (!data.images || data.images.length <= 1) return;

        if (cursorDirection === 'left') {
            prevImage();
        } else {
            nextImage();
        }
    };

    const hasGallery = data.images && data.images.length > 1;

    return (
        <motion.div
            id={`milestone-${index}`}
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.8, 0.25, 1] }}
            className="relative w-full my-32 md:my-48"
        >
            <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-16 xl:gap-20">

                {/* Left Side: Editorial Content */}
                <div className="flex-1 min-w-0 w-full relative pr-0 xl:pr-6">

                    {/* Number & Title Row */}
                    <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8 mb-6">
                        <span className="text-sm font-sans font-medium text-gray-900 mt-2 md:mt-[1.125rem] shrink-0">
                            {String(index + 1).padStart(2, '0')}
                        </span>
                        <h2
                            className="text-[3.5rem] sm:text-[4.5rem] md:text-[5.5rem] lg:text-[3.5rem] xl:text-[4.5rem] 2xl:text-[5.5rem] leading-[0.85] font-playfair text-[#ff2800] lowercase tracking-tight m-0 break-words"
                            style={{ overflowWrap: 'break-word', hyphens: 'auto' }}
                        >
                            {data.title}
                        </h2>
                    </div>

                    {/* Description & Meta (Indented slightly on larger screens) */}
                    <div className="md:pl-[4.5rem] mt-8 max-w-xl">
                        <p className="font-sans text-gray-800 text-base md:text-lg leading-relaxed mb-10">
                            {data.description}
                        </p>

                        {/* Elegant Divider */}
                        <hr className="border-t border-gray-200 mb-8" />

                        {/* 2-Column Tags Grid */}
                        <div className="grid grid-cols-2 gap-y-5 gap-x-8 text-[11px] font-sans font-bold tracking-[0.15em] uppercase text-gray-900 mb-10">
                            {data.tags.map((tag, i) => (
                                <span key={i}>{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: Image Placeholder */}
                <div
                    ref={containerRef}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setIsHoveringGallery(true)}
                    onMouseLeave={() => setIsHoveringGallery(false)}
                    onClick={handleGalleryClick}
                    className={`flex w-full lg:w-[38%] xl:w-[45%] mt-8 lg:mt-0 aspect-[4/3] relative group ${hasGallery ? 'cursor-none' : ''}`}
                >
                    {/* Inner image container that actually hides overflow */}
                    <div className="absolute inset-0 bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden rounded-sm">
                        {/* Abstract overlay to make it look like a placeholder image */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-gray-100 mix-blend-multiply opacity-50 transition-opacity duration-500 group-hover:opacity-20 z-10 pointer-events-none"></div>

                        {/* If there's an actual image, we can show it here, otherwise just the placeholder */}
                        {data.images && data.images.length > 0 && (
                            <motion.img
                                key={currentImageIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.8 }}
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                src={data.images[currentImageIndex]}
                                alt={data.title}
                                className="absolute inset-0 w-full h-full object-cover mix-blend-multiply pointer-events-none"
                            />
                        )}

                        {/* Dots */}
                        {hasGallery && (
                            <div className="absolute bottom-6 right-6 flex gap-1.5 z-20 pointer-events-none">
                                {data.images.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-1.5 rounded-full transition-all duration-500 ease-out ${idx === currentImageIndex ? 'w-5 bg-[#ff2800]' : 'w-1.5 bg-gray-300'}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Custom Awards-style Cursor (rendered outside the overflow-hidden inner div) */}
                    {hasGallery && (
                        <motion.div
                            className="absolute top-0 left-0 pointer-events-none z-50 flex items-center justify-center mix-blend-difference text-white whitespace-nowrap"
                            style={{
                                x: cursorX,
                                y: cursorY,
                                translateX: "-50%",
                                translateY: "-50%",
                                scale: isHoveringGallery ? 1 : 0,
                                opacity: isHoveringGallery ? 1 : 0
                            }}
                            transition={{ scale: { duration: 0.2 }, opacity: { duration: 0.2 } }}
                        >
                            <motion.div
                                initial={false}
                                animate={{
                                    x: cursorDirection === 'left' ? -10 : 10,
                                }}
                                className="flex items-center gap-2"
                            >
                                {cursorDirection === 'left' && (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" /></svg>
                                )}
                                <span className="text-sm font-sans font-bold tracking-[0.2em] uppercase">
                                    {cursorDirection === 'left' ? 'Prev' : 'Next'}
                                </span>
                                {cursorDirection === 'right' && (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </div>

            </div>
        </motion.div>
    );
};

export function ClientAboutTimeline({ milestones }: { milestones: Milestone[] }) {
    const trackRef = useRef<HTMLDivElement>(null);

    // Track scroll progress within the timeline container
    const { scrollYProgress } = useScroll({
        target: trackRef,
        offset: ["0% 40%", "100% 40%"] // When top of track hits 40% of viewport, start. Stop when bottom hits 40%.
    });

    // Add buttery smooth dampening to the strict scroll progress
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 60,
        damping: 15,
        restDelta: 0.001
    });

    // Map 0-1 progress strictly to 0%-100% of the track's height
    const carTop = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

    const handleSelectMilestone = (index: number) => {
        const el = document.getElementById(`milestone-${index}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    return (
        <div className="min-h-screen bg-[#ffffff] text-gray-900 font-sans selection:bg-[#ff2800] selection:text-white">
            <FontInjection />

            {/* Elegant Editorial Hero Section */}
            <header className="h-screen flex flex-col items-center justify-center relative bg-white px-4">
                <div className="z-10 text-center flex flex-col items-center">
                    <p className="text-gray-400 font-sans text-xs font-bold tracking-[0.3em] uppercase mb-8">
                        Est. 2018
                    </p>
                    <h1 className="text-7xl md:text-[9rem] font-playfair text-[#111] lowercase tracking-tight leading-none mb-6">
                        portfolio <br />
                        <span className="text-[#ff2800] italic pr-4">timeline</span>
                    </h1>
                    <p className="mt-8 text-lg md:text-xl text-gray-500 max-w-xl mx-auto font-sans font-light leading-relaxed">
                        A curated journey through my professional milestones, blending classic engineering with modern precision.
                    </p>

                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.5, type: "spring" }}
                        className="mt-20 animate-bounce"
                    >
                        <svg className="w-6 h-6 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </motion.div>
                </div>
            </header>

            {/* Timeline Section */}
            <section className="relative w-full max-w-[90rem] mx-auto px-6 sm:px-12 py-24 flex">

                {/* Left Column: Subtle track container (moved line to center) */}
                <div className="w-24 md:w-40 lg:w-56 flex-shrink-0 relative flex justify-center">
                    {/* Pristine 1px elegant line right down the center */}
                    <div
                        ref={trackRef}
                        className="absolute top-0 bottom-0 w-[1px] bg-gray-200"
                    ></div>

                    {/* F1 Car PNG Image on the track */}
                    <motion.div
                        className="absolute left-1/2 z-20 will-change-transform"
                        style={{ top: carTop, x: "-50%", y: "-50%" }}
                    >
                        <img
                            src="/2D_Assets/car.png"
                            alt="F1 Car Indicator"
                            // -rotate-90 applies to the child so it points down
                            className="w-[200px] md:w-[320px] lg:w-[480px] max-w-none h-auto drop-shadow-xl -rotate-90"
                            style={{ willChange: "transform" }}
                        />
                    </motion.div>
                </div>

                {/* Right Column: Milestones */}
                <div className="flex-1 pb-32 pt-16">
                    {milestones.map((milestone, index) => (
                        <MilestoneItem key={milestone.id} data={milestone} index={index} />
                    ))}
                </div>

            </section>

            {/* Editorial Footer */}
            <footer className="min-h-[40vh] py-24 bg-white border-t border-gray-100 flex flex-col items-center justify-center relative">
                <div className="relative z-10 flex flex-col items-center px-4 text-center">
                    <h2 className="text-5xl md:text-7xl font-playfair text-[#111] lowercase tracking-tight mb-8">
                        the finish line <br />
                        <span className="text-[#ff2800] italic">is the beginning</span>
                    </h2>

                    <p className="text-gray-500 font-sans text-lg max-w-md mb-10 font-light">
                        Ready to accelerate your vision? Let's engineer something world-class together.
                    </p>

                </div>
            </footer>
        </div>
    );
}
