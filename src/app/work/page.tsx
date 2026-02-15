'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getProjects, type Project } from '@/components/work/projectsData';
import Footer from '@/components/Footer';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

function getProjectImage(project: Project): string {
  if (project.media?.length) {
    const first = project.media[0];
    if (first.type === 'image') return first.url;
  }
  return project.src || '';
}

function ExploreProjectLink({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false);
  const [textFlipped, setTextFlipped] = useState(false);
  const flipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearFlipTimer = () => {
    if (flipTimerRef.current) {
      clearTimeout(flipTimerRef.current);
      flipTimerRef.current = null;
    }
  };

  const handleMouseEnter = () => {
    clearFlipTimer();
    setHovered(true);
    setTextFlipped(true);
    flipTimerRef.current = setTimeout(() => {
      setTextFlipped(false);
      flipTimerRef.current = null;
    }, 400);
  };

  const handleMouseLeave = () => {
    clearFlipTimer();
    setHovered(false);
    setTextFlipped(false);
  };

  useEffect(() => {
    return () => clearFlipTimer();
  }, []);

  return (
    <Link
      href={href}
      className="group flex items-center gap-6"
      aria-label={`Discover ${label}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="accent-serif relative h-5 overflow-hidden text-[11px] font-semibold tracking-[0.15em] uppercase">
        <div
          className="transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{ transform: textFlipped ? 'translateY(-100%)' : 'translateY(0)' }}
        >
          <span className="block h-5 leading-5 text-[#FF2800]">Discover Work</span>
          <span className="block h-5 leading-5">Discover Work</span>
        </div>
      </div>
      <div
        className={`relative h-px transition-all duration-700 ${
          hovered ? 'w-20 bg-[#FF2800]' : 'w-12 bg-black/20'
        }`}
      >
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-t border-r border-[#FF2800] transition-transform duration-500"
          style={{ transform: hovered ? 'rotate(45deg) scale(1)' : 'rotate(45deg) scale(0)' }}
        />
      </div>
    </Link>
  );
}

export default function WorkPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const mountainRef = useRef<HTMLDivElement>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (e) {
        console.error('Failed to fetch projects:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useGSAP(
    () => {
      if (loading || projects.length === 0 || !triggerRef.current || !lineRef.current) return;

      if (mountainRef.current) {
        gsap.to(mountainRef.current, {
          y: -60,
          ease: 'none',
          scrollTrigger: {
            trigger: triggerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }

      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: triggerRef.current,
            start: 'top center',
            end: 'bottom center',
            scrub: true,
          },
        }
      );
      ScrollTrigger.refresh();

      const items = gsap.utils.toArray<HTMLElement>('.project-item', containerRef.current);
      items.forEach((item) => {
        const img = item.querySelector('.img-reveal');
        const text = item.querySelector('.text-reveal');

        if (img) {
          gsap.fromTo(
            img,
            { clipPath: 'inset(10% 10% 10% 10%)', opacity: 0 },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              opacity: 1,
              duration: 1.5,
              ease: 'expo.out',
              scrollTrigger: { trigger: item, start: 'top bottom-=100', toggleActions: 'play none none reverse' },
            }
          );
        }

        if (text) {
          gsap.fromTo(
            text,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.2,
              delay: 0.2,
              ease: 'power3.out',
              scrollTrigger: { trigger: item, start: 'top bottom-=50', toggleActions: 'play none none reverse' },
            }
          );
        }
      });

      return () => {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    },
    { scope: containerRef, dependencies: [loading, projects.length] }
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFA] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#121212] border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] tracking-[0.4em] uppercase font-bold text-[#121212]/60">Loading</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-[#FBFBFA] text-[#1a1a1a] selection:bg-[#FF2800] selection:text-white min-h-screen font-sans overflow-x-hidden"
      ref={containerRef}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&family=Inter:wght@300;400;700;900&display=swap"
        rel="stylesheet"
      />

      <div
        ref={mountainRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-[0.03]"
      >
        <svg viewBox="0 0 1000 500" preserveAspectRatio="none" className="w-full h-full fill-none stroke-black stroke-[1]">
          <path d="M-100,500 L300,100 L600,300 L900,50 L1200,450" />
        </svg>
      </div>

      <section className="h-screen flex flex-col items-center justify-center relative px-6 z-10 text-center">
        <div className="overflow-hidden">
          <p className="text-[#FF2800] text-[10px] tracking-[0.5em] font-bold uppercase mb-8 font-sans">
            Selected Expeditions
          </p>
        </div>
        <h1 className="text-7xl md:text-[11rem] serif-font font-black leading-[0.8] tracking-tighter uppercase">
          Grand <br /> <span className="italic font-light">Ascent</span>
        </h1>
        <div className="mt-20 flex flex-col items-center gap-6 opacity-20">
          <div className="w-px h-16 bg-black" />
          <span className="text-[8px] tracking-[0.4em] uppercase font-sans">Scroll to descend</span>
        </div>
      </section>

      <section className="relative pb-60 pt-40" ref={triggerRef}>
        <div className="absolute left-1/2 top-0 bottom-0 w-[0.5px] bg-black/[0.05] -translate-x-1/2 z-0" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 pointer-events-none z-[5] overflow-hidden">
          <div
            ref={lineRef}
            className="absolute left-0 top-0 w-full h-full bg-[#FF2800] origin-top"
            style={{ transform: 'scaleY(0)' }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-10">
          {projects.length === 0 ? (
            <div className="min-h-[50vh] flex items-center justify-center">
              <p className="text-[#1a1a1a]/60 italic">No projects yet.</p>
            </div>
          ) : (
            projects.map((project) => {
              const imageUrl = getProjectImage(project);
              const year = project.year ?? new Date().getFullYear().toString();
              return (
                <div
                  key={project.id}
                  className="project-item min-h-screen grid grid-cols-1 md:grid-cols-12 md:gap-x-32 gap-y-16 gap-20 items-center relative mb-40"
                >
                  <div className="absolute left-1/2 -translate-x-1/2 top-0 z-10">
                    <span className="font-sans text-[10px] font-bold text-[#FF2800] bg-[#FBFBFA] px-4 py-1 border border-[#FF2800]/20 rounded-full tracking-tighter">
                      {year}
                    </span>
                  </div>

                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block w-2 h-2 rounded-full bg-[#FF2800]" aria-hidden />

                  <div className="md:col-span-5 z-20 min-w-0 relative md:order-1">
                    <div className="text-reveal px-4">
                      <p className="font-sans text-[10px] tracking-[0.4em] font-bold text-black/30 uppercase mb-8">
                        {project.category}
                      </p>
                      <h3
                        className="serif-font font-bold mb-10 tracking-tighter uppercase leading-[0.85] min-w-0"
                        style={{ wordSpacing: '0.08em', fontSize: 'clamp(2.5rem, 5vw, 6rem)' }}
                      >
                        {project.title}
                      </h3>
                      <div className="project-text-cta">
                        <ExploreProjectLink href={`/work/${project.slug}`} label={project.title} />
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-7 z-10 md:order-2 md:pl-8">
                    <Link href={`/work/${project.slug}`} className="block">
                      <div className="img-reveal relative overflow-hidden aspect-[16/10] cursor-pointer bg-white group shadow-sm border border-black/[0.03] max-w-4xl md:ml-auto">
                        <img
                          src={imageUrl}
                          alt={project.title}
                          className="w-full h-full object-cover grayscale opacity-80 transition-all duration-[1.5s] group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                        />
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      <Footer />

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .serif-font { font-family: 'Playfair Display', serif; }
            body { background-color: #FBFBFA; }
          `,
        }}
      />
    </div>
  );
}