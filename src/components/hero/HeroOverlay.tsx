"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";

const SCROLL_HIDE_THRESHOLD = 120;

export default function HeroOverlay() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      setShowScrollIndicator(window.scrollY <= SCROLL_HIDE_THRESHOLD);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // 1. Custom Cursor Logic
    const cursor = cursorRef.current;

    // Move cursor to initial mouse position
    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      // Use GSAP for smooth lag
      gsap.to(cursor, {
        x: clientX,
        y: clientY,
        duration: 0.15, // Smooth lag
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", onMouseMove);

    // 2. Scroll Indicator Animation
    const scrollIndicator = scrollRef.current;
    if (scrollIndicator) {
      gsap.to(scrollIndicator.querySelector('.arrow'), {
        y: 10,
        repeat: -1,
        yoyo: true,
        duration: 0.8,
        ease: "power1.inOut"
      });
    }

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-50 pointer-events-none">
      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[100] transform -translate-x-1/2 -translate-y-1/2 rounded-full border border-pulse/50 mix-blend-difference"
        style={{
          backgroundColor: 'rgba(255, 50, 50, 0.1)', // Subtle red tint
          boxShadow: '0 0 10px rgba(255, 50, 50, 0.3)' // Subtle glow
        }}
      />

      {/* Scroll Indicator — animates down and fades when scrolling */}
      <div
        ref={scrollRef}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-40 transition-all duration-500"
        style={{
          opacity: showScrollIndicator ? 0.8 : 0,
          transform: `translateX(-50%) translateY(${showScrollIndicator ? 0 : 30}px)`,
          pointerEvents: showScrollIndicator ? "auto" : "none"
        }}
      >
        <span className="text-xs uppercase tracking-[0.2em] text-gray-500 font-medium">
          Scroll
        </span>
        <div className="arrow text-pulse">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
          </svg>
        </div>
      </div>
    </div>
  );
}
