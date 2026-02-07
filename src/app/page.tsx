"use client";

import { Suspense, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas } from "@react-three/fiber";
import { useLenis } from "lenis/react";

gsap.registerPlugin(ScrollTrigger);
import HeroOverlay from "@/components/hero/HeroOverlay";
import RickshawHero from "@/components/hero/RickshawHero";

export default function Home() {
  const contentRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  // Sync ScrollTrigger with Lenis - only once
  useEffect(() => {
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);

      return () => {
        lenis.off('scroll', ScrollTrigger.update);
      };
    }
  }, []); // Empty dependency array - only run once

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".feature", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.8,
      });
    }, contentRef);

    return () => ctx.revert();
  }, []);

  // Intro slides in from left as user scrolls down — feels like going left by scrolling
  useEffect(() => {
    if (!introRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        introRef.current,
        {
          x: "100vw",
          opacity: 0,
          filter: "blur(20px)",
          scale: 0.9
        },
        {
          x: 0,
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: introRef.current,
            start: "top bottom",
            end: "top center",
            scrub: 1.2,
            markers: false,
            invalidateOnRefresh: true,
          },
        }
      );
    }, contentRef);

    return () => ctx.revert();
  }, []);

  // Rickshaw moves down-right as user scrolls
  useEffect(() => {
    const rickshawCanvas = document.querySelector('.rickshaw-canvas');
    if (!rickshawCanvas) return;

    const ctx = gsap.context(() => {
      gsap.to(rickshawCanvas, {
        y: 400,
        x: 300,
        scale: 0.6,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: '.hero-section',
          start: "top top",
          end: "+=100vh",
          scrub: 1,
          markers: false,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="relative bg-white overflow-x-hidden">
      <div ref={contentRef} className="relative z-10">
        {/* Hero Section */}
        <section className="relative h-screen hero-section">
          <div className="absolute inset-0 z-0 rickshaw-canvas">
            <Canvas
              camera={{ position: [0, 0, 8], fov: 45 }}
              gl={{
                antialias: true,
                alpha: true,
                powerPreference: "high-performance",
              }}
              dpr={[1, 2]}
            >
              <Suspense fallback={null}>
                <RickshawHero />
              </Suspense>
            </Canvas>
          </div>
          <HeroOverlay />
        </section>

        {/* Introduction — slides in from left as you scroll down */}
        <section
          ref={introRef}
          className="relative z-20 min-h-screen bg-white px-6 py-24 flex flex-col items-center justify-center"
        >
          <div className="max-w-4xl w-full">
            <h2 className="text-4xl md:text-6xl font-bold mb-12 feature">
              Introduction
            </h2>
          </div>
        </section>

        {/* Additional Content Section */}
        <section className="flex min-h-screen w-full flex-col items-center justify-center bg-canvas-depth px-6 py-24">
          <div className="max-w-4xl w-full">
            <h2 className="text-4xl md:text-6xl font-bold mb-12 feature">
              The New <span className="text-pulse">Standard</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[
                { title: "Canvas", desc: "Pure black foundations with subtle depth increments." },
                { title: "Typography", desc: "Silver-white content optimized for visual clarity." },
                { title: "Pulse", desc: "A vibrant red signature that commands attention." },
                { title: "Shadow", desc: "Deep blood-red accents for multi-dimensional feel." }
              ].map((item, i) => (
                <div key={i} className="group border-l border-pulse/20 pl-6 py-4 feature">
                  <h3 className="text-xl font-bold group-hover:text-pulse transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="mt-2 opacity-50 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer / CTA */}
        <section className="flex h-[50vh] w-full items-center justify-center">
          <button className="px-10 py-4 bg-pulse text-background font-bold uppercase tracking-widest hover:bg-shadow transition-colors duration-500 rounded-none feature">
            Start Experimenting
          </button>
        </section>
      </div>
    </main>
  );
}
