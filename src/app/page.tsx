"use client";

import { Suspense, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas } from "@react-three/fiber";
import { useLenis } from "lenis/react";

gsap.registerPlugin(ScrollTrigger);
import HeroOverlay from "@/components/hero/HeroOverlay";
import RickshawHero, { RickshawHeroHandle } from "@/components/hero/RickshawHero";

export default function Home() {
  const contentRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const rickshawHeroRef = useRef<RickshawHeroHandle>(null);
  const cameraPositionProxy = useRef({ x: 0, y: 0.9, z: 5 });
  const dissolveProxy = useRef({ value: 0 });
  const heroContentOutProxy = useRef({ value: 0 });
  const lenis = useLenis();

  const positionRef = cameraPositionProxy.current;
  const dissolveRef = dissolveProxy;
  const heroContentOutRef = heroContentOutProxy;

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

  // Main Camera-Driven Scroll Timeline (no dependency on hero ref – hero reads from same proxies)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".scroll-driver",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          markers: false,
          invalidateOnRefresh: true,
        },
      });

      // Hero text/content animates out over first 40% (navbar-like)
      tl.to(
        heroContentOutProxy.current,
        { value: 1, duration: 0.4, ease: "power2.inOut" },
        0
      );

      // Phase 1 (0% - 60%): Camera zoom forward (z 5→2) + wave dissolve (Thanos + red edge)
      tl.to(
        cameraPositionProxy.current,
        { z: 2, duration: 0.6, ease: "none" },
        0
      ).to(
        dissolveProxy.current,
        { value: 1, duration: 0.6, ease: "none" },
        0
      );

      // Phase 2 (60% - 80%): Camera passes objects (z 2→-2)
      tl.to(cameraPositionProxy.current, {
        z: -2,
        duration: 0.2,
        ease: "none",
      });

      // Phase 3 (80% - 100%): Introduction fade in
      tl.to(
        () => introRef.current,
        { opacity: 1, duration: 0.2, ease: "power2.out" },
        "-=0.2"
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="relative bg-white overflow-x-hidden">
      <div ref={contentRef} className="relative z-10">
        {/* Hero Section: 300vh so intro is in view at 80–100% and Standard only after */}
        <section className="relative h-[300vh] hero-section">
          <div className="scroll-driver h-[300vh] absolute top-0 left-0 w-full pointer-events-none" />

          <div className="fixed inset-0 top-0 z-0 rickshaw-canvas" style={{ minHeight: "100dvh" }}>
            <Canvas
              camera={{ position: [0, 0, 5], fov: 70 }}
              gl={{
                antialias: true,
                alpha: true,
                powerPreference: "high-performance",
              }}
              dpr={[1, 2]}
            >
              <Suspense fallback={null}>
                <RickshawHero
                  ref={rickshawHeroRef}
                  positionRef={positionRef}
                  dissolveRef={dissolveRef}
                  heroContentOutRef={heroContentOutRef}
                />
              </Suspense>
            </Canvas>
          </div>
          <HeroOverlay />
          {/* Introduction — inside hero so it’s in view when timeline hits 80–100% */}
          <section
            ref={introRef}
            className="absolute bottom-0 left-0 right-0 z-20 min-h-screen bg-white px-6 py-24 flex flex-col items-center justify-center opacity-0 pointer-events-none"
          >
            <div className="max-w-4xl w-full pointer-events-auto">
              <h2 className="text-4xl md:text-6xl font-bold mb-12 feature">
                Introduction
              </h2>
            </div>
          </section>
        </section>

        {/* Additional Content Section — only after hero + intro */}
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
