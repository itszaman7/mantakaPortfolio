"use client";

import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import gsap from "gsap";

interface AnimatedTitleProps {
    text: string;
    translatedText?: string;
    className?: string;
}

export default function AnimatedTitle({ text, translatedText, className = "" }: AnimatedTitleProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    
    // State
    const [isTranslated, setIsTranslated] = useState(false);
    const [currentText, setCurrentText] = useState(text);
    
    // Animation Locks
    const isAnimating = useRef(false);
    const expectFlipIn = useRef(false);

    // 1. Mouse Parallax
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!textRef.current || isAnimating.current) return;
            const x = (e.clientX / window.innerWidth - 0.5) * -20;
            const y = (e.clientY / window.innerHeight - 0.5) * -20;

            gsap.to(textRef.current, { 
                x, 
                y, 
                duration: 1, 
                ease: "power2.out",
                overwrite: "auto"
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // 2. Flip Logic
    const handleFlip = () => {
        if (!translatedText || isAnimating.current || !textRef.current) return;
        isAnimating.current = true;

        gsap.to(textRef.current, {
            rotationX: 90,
            scale: 0.9,
            opacity: 0,
            duration: 0.25,
            ease: "power2.in",
            onComplete: () => {
                expectFlipIn.current = true;
                if (isTranslated) {
                    setIsTranslated(false);
                    setCurrentText(text);
                } else {
                    setIsTranslated(true);
                    setCurrentText(translatedText);
                }
            }
        });
    };

    // 3. Flip In
    useLayoutEffect(() => {
        if (!textRef.current || !expectFlipIn.current) return;
        expectFlipIn.current = false;

        gsap.fromTo(textRef.current,
            { rotationX: -90, scale: 0.9, opacity: 0 },
            {
                rotationX: 0,
                scale: 1,
                opacity: 1,
                duration: 0.4,
                ease: "back.out(1.7)",
                onComplete: () => {
                    isAnimating.current = false;
                }
            }
        );
    }, [currentText, isTranslated]);

    return (
        <div
            ref={containerRef}
            onClick={handleFlip}
            // FIX: Added 'leading-[0.85]' here so the container height collapses to fit the text
            className={`select-none relative cursor-pointer perspective-1000 leading-[1.15] ${className}`}
            style={{ perspective: "1000px" }}
        >
            <h1
                ref={textRef}
                // Keeping leading here too ensures the text itself is tight
                className="leading-[0.85] font-bold tracking-tighter inline-block origin-center will-change-transform transition-colors duration-0"
                style={{
                    transformStyle: "preserve-3d",
                    fontFamily: isTranslated ? 'var(--font-li-ador), sans-serif' : 'inherit',
                    fontSize: isTranslated ? '0.85em' : 'inherit',
                    padding: isTranslated ? '0.1em 0' : '0',
                    letterSpacing: isTranslated ? 'normal' : '-0.05em'
                }}
            >
                {currentText}
            </h1>
        </div>
    );
}