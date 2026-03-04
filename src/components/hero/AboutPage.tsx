"use client";

import React, { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const AboutPage = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const bigTextRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!mainRef.current) return;

    let removeTextRefresh: (() => void) | null = null;
    const ctx = gsap.context(() => {
      const imgEl = imageRef.current;
      const container = mainRef.current;
      if (imgEl) {
        gsap.set(imgEl, { clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)', scale: 0.97 });
        gsap.to(imgEl, {
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          scale: 1,
          opacity: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: imgEl,
            start: 'top 88%',
            end: 'top 35%',
            scrub: 2,
            toggleActions: 'play none none reverse'
          }
        });
        if (container) {
          gsap.to(imgEl, {
            opacity: 0.25,
            scale: 0.98,
            ease: 'power2.in',
            scrollTrigger: {
              trigger: container,
              start: 'bottom 30%',
              end: 'bottom -50%',
              scrub: 3
            }
          });
        }
      }

      const textEl = textRef.current;
      if (textEl) {
        const textElements = textEl.querySelectorAll('.reveal-text');
        const setTextVisibleIfInView = () => {
          const rect = textEl.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.95) {
            gsap.set(textElements, { y: 0, opacity: 1, clearProps: 'transform,opacity' });
          }
        };
        gsap.fromTo(textElements,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.06,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: textEl,
              start: 'top 92%',
              toggleActions: 'play none none reverse'
            }
          }
        );
        ScrollTrigger.addEventListener('refresh', setTextVisibleIfInView);
        requestAnimationFrame(() => setTextVisibleIfInView());
        removeTextRefresh = () => ScrollTrigger.removeEventListener('refresh', setTextVisibleIfInView);
      }

      if (bigTextRef.current && mainRef.current) {
        gsap.to(bigTextRef.current, {
          scrollTrigger: {
            trigger: mainRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1
          },
          y: -100,
          opacity: 0.5
        });
      }
    }, mainRef);

    return () => {
      removeTextRefresh?.();
      ctx.revert();
    };
  }, { scope: mainRef });

  return (
    <div ref={mainRef} className="min-h-screen bg-white text-[#1a1a1a] font-sans selection:bg-[#FF2800] selection:text-white overflow-hidden relative">
      <main className="relative pt-20 pb-20 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto min-h-screen flex flex-col justify-center">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-x-16 lg:gap-y-16 items-center">

          {/* Left Column: Text Content - more columns so headline isn't clipped */}
          <div ref={textRef} className="lg:col-span-8 relative z-20 order-2 lg:order-1 min-w-0 pr-6 lg:pr-16">

            {/* Minimal spacing */}
            <div className="h-12"></div>

            <div className="overflow-hidden mb-4">
              <h1 className="reveal-text text-5xl md:text-6xl xl:text-7xl serif-font leading-[1.1] tracking-tight transition-transform duration-300 hover:-translate-y-0.5">
                Intelligent&nbsp;<span className="text-[#FF2800] italic font-normal transition-all duration-300 hover:tracking-wide">AI.</span>
              </h1>
            </div>

            <div className="overflow-hidden mb-12">
              <h1 className="reveal-text text-5xl md:text-6xl xl:text-7xl serif-font leading-[1.1] tracking-tight transition-transform duration-300 hover:-translate-y-0.5">
                Dynamic&nbsp;<span className="text-[#FF2800] italic font-normal transition-all duration-300 hover:tracking-wide">Design.</span>
              </h1>
            </div>

            <div className="overflow-hidden mb-12">
              <p className="reveal-text text-gray-500 text-lg md:text-xl font-light max-w-sm leading-relaxed transition-colors duration-300 hover:text-gray-700">
                Constructing the <span className="text-[#1a1a1a] font-normal border-b-2 border-[#FF2800] transition-all duration-300 hover:text-[#FF2800] hover:border-[#FF2800]/80 cursor-default">invisible</span> into the unforgettable.
              </p>
            </div>

            <div className="reveal-text">
              <a href="#" className="group inline-flex items-center gap-3 serif-font italic text-sm text-gray-900 transition-all duration-300 hover:text-[#FF2800] border-b border-transparent hover:border-[#FF2800] pb-1">
                Story
                <ArrowUpRight size={14} className="text-[#FF2800] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </div>
          </div>

          {/* Right Column: Image - constrained so it doesn't cover the screen */}
          <div className="lg:col-span-4 relative order-1 lg:order-2 h-[45vh] lg:h-[55vh] lg:max-w-[420px] lg:ml-auto group">
            <div className="absolute inset-0 bg-[#f0f0f0] -z-10"></div>
            <div ref={imageRef} className="w-full h-full relative overflow-hidden bg-gray-100 rounded-sm transition-transform duration-500 ease-out group-hover:scale-[1.03]">
              <img
                src="/2D_Assets/me.jpg"
                alt="Portrait"
                className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-700 ease-out group-hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* Big Background Text - Anchored at bottom */}
        <div ref={bigTextRef} className="absolute bottom-0 left-0 w-full pointer-events-none -z-10 overflow-hidden select-none">
          <h2 className="text-[18vw] leading-[0.8] serif-font font-bold text-[#1a1a1a] opacity-[0.03] translate-y-[10%]">
            ABOUT
          </h2>
        </div>

      </main>
    </div>
  );
};

export default AboutPage;