"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import MonitorHero from "./MonitorHero";

export default function SimpleHero() {
    const heroRef = useRef<HTMLDivElement>(null);
    const zamanRef = useRef<HTMLHeadingElement>(null);
    const mantakaRef = useRef<HTMLHeadingElement>(null);
    const crtRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            setMousePosition({ x, y });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate text in with stagger
            gsap.from([zamanRef.current, mantakaRef.current], {
                y: 120,
                opacity: 0,
                duration: 1.4,
                stagger: 0.25,
                ease: "power4.out",
                delay: 0.2,
            });

            // Animate CRT monitor fade-in
            gsap.from(crtRef.current, {
                scale: 0.9,
                opacity: 0,
                duration: 1.6,
                ease: "power4.out",
                delay: 0.3,
            });

            // Subtle floating animation for text
            gsap.to([zamanRef.current, mantakaRef.current], {
                y: -8,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: 0.2,
                delay: 1.8,
            });
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={heroRef}
            className="relative h-screen w-full bg-[#f5f5f5] flex items-center justify-center overflow-hidden"
        >
            {/* Subtle noise texture overlay */}
            <div
                className="absolute inset-0 opacity-[0.015] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
                }}
            />


            {/* Massive background typography - covering the screen */}
            <div
                className="absolute inset-0 flex flex-col items-start justify-center px-4 md:px-8 lg:px-12 overflow-hidden"
                style={{
                    transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`,
                    transition: "transform 0.3s ease-out",
                }}
            >
                <h1
                    ref={zamanRef}
                    className="font-space-grotesk text-[clamp(8rem,25vw,22rem)] font-bold leading-[0.8] tracking-[-0.04em] text-[#0a0a0a] uppercase opacity-90"
                    style={{
                        letterSpacing: '-0.04em',
                    }}
                >
                    Zaman
                </h1>
                <h2
                    ref={mantakaRef}
                    className="font-space-grotesk text-[clamp(8rem,25vw,22rem)] font-bold leading-[0.8] tracking-[-0.04em] text-[#0a0a0a] uppercase opacity-90"
                    style={{
                        letterSpacing: '-0.04em',
                    }}
                >
                    Mantaka
                </h2>
            </div>

            {/* CRT Monitor with Tic-Tac-Toe Game - positioned to the right */}
            <div
                ref={crtRef}
                className="absolute right-[2%] md:right-[5%] top-[40%] md:top-[42%] z-20 w-[55%] md:w-[50%] lg:w-[48%] max-w-[850px] aspect-[4/3]"
            >
                <MonitorHero />
            </div>

            {/* Subtitle/tagline - positioned at bottom */}
            <div className="absolute bottom-24 left-8 md:left-16 z-10">
                <p className="font-jetbrains-mono text-[clamp(0.75rem,1.5vw,1rem)] tracking-[0.15em] text-[#0a0a0a] opacity-60 uppercase">
                    & make harmony
                </p>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 animate-bounce z-10">
                <span className="text-[0.65rem] uppercase tracking-[0.25em] text-[#0a0a0a] font-jetbrains-mono font-medium">
                    Scroll
                </span>
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[#0a0a0a]"
                >
                    <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                </svg>
            </div>
        </section>
    );
}

