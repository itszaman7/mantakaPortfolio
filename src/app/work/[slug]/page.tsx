'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import Footer from '@/components/Footer';
import { getProjectBySlug, getOtherProjects, type Project } from '@/components/work/projectsData';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [otherProjects, setOtherProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroWrapRef = useRef<HTMLDivElement>(null);
  const heroLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!slug) return;
      setLoading(true);
      const [current, others] = await Promise.all([
        getProjectBySlug(slug),
        getOtherProjects(slug as string, 4),
      ]);
      setProject(current || null);
      setOtherProjects(others);
      setLoading(false);
    };
    loadData();
  }, [slug]);

  useGSAP(
    () => {
      if (loading || !project || !containerRef.current) return;

      // Hero title: word-by-word stagger
      if (heroWrapRef.current) {
        const words = heroWrapRef.current.querySelectorAll('.hero-word');
        gsap.fromTo(
          words,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.06,
            delay: 0.15,
          }
        );
      }
      // Hero underline: draw after title
      if (heroLineRef.current) {
        gsap.fromTo(
          heroLineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.8,
            ease: 'power2.inOut',
            delay: 0.5,
          }
        );
      }

      // Left column: section label then body stagger
      gsap.utils.toArray<HTMLElement>('.reveal-section').forEach((el) => {
        const label = el.querySelector('.reveal-label');
        const body = el.querySelector('.reveal-body');
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
        tl.fromTo(el, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' });
        if (label) tl.fromTo(label, { x: -12, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, 0.1);
        if (body) tl.fromTo(body, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.18);
      });

      // Right column media cards: scale + slide + slight rotation on scroll
      gsap.utils.toArray<HTMLElement>('.media-card').forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 72, scale: 0.94, opacity: 0 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
            delay: i * 0.12,
          }
        );
      });

      // Footer: "Next Project" heading + cards with inner stagger
      const nextHeading = containerRef.current.querySelector('.next-project-heading');
      if (nextHeading) {
        gsap.fromTo(
          nextHeading,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: nextHeading,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
      gsap.utils.toArray<HTMLElement>('.next-project-card').forEach((el, i) => {
        const cardContent = el.querySelector('.next-card-content');
        gsap.fromTo(
          el,
          { y: 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
            delay: 0.05 + i * 0.1,
          }
        );
        if (cardContent) {
          const cat = cardContent.querySelector('.next-card-cat');
          const title = cardContent.querySelector('.next-card-title');
          const btn = cardContent.querySelector('.next-card-btn');
          const tl = gsap.timeline({
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
            delay: 0.2 + i * 0.1,
          });
          if (cat) tl.fromTo(cat, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' });
          if (title) tl.fromTo(title, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, 0.05);
          if (btn) tl.fromTo(btn, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(1.2)' }, 0.1);
        }
      });
    },
    { dependencies: [loading, project], scope: containerRef }
  );

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#f4f4f5] flex items-center justify-center z-[100]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin" />
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase">Loading</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#f4f4f5] flex flex-col items-center justify-center text-neutral-900">
        <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
        <Link href="/" className="text-neutral-600 hover:text-red-600 transition-colors underline">
          Return Home
        </Link>
      </div>
    );
  }

  const mediaItems =
    project.media && project.media.length > 0
      ? project.media
      : [{ type: 'image' as const, url: project.src }];

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#f4f4f5] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white overflow-x-hidden"
    >
      {/* Main Title Hero Section */}
      <section className="relative border-b border-neutral-200 bg-white pt-8 md:pt-12 pb-12 px-6 md:px-12 overflow-hidden">
        <div ref={heroWrapRef} className="flex flex-wrap items-baseline gap-x-[0.25em] gap-y-0">
          {project.title.split(/\s+/).map((word, i) => (
            <span
              key={i}
              className="hero-word font-sans text-[clamp(2.75rem,12vw,10rem)] font-bold leading-[0.88] tracking-[-0.04em] uppercase text-[#1a1a1a] inline-block"
            >
              {word}
            </span>
          ))}
        </div>
        <div
          ref={heroLineRef}
          className="mt-6 h-[3px] w-24 bg-[#1a1a1a] origin-left rounded-full"
        />
      </section>

      {/* Project Body: Info & Media */}
      <main className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        {/* Left Column: Project Metadata */}
        <aside className="lg:col-span-5 xl:col-span-4 border-r border-neutral-200 px-6 md:px-12 py-16 md:py-24 space-y-20 bg-white/50">
          <div className="reveal-section space-y-5">
            <h2 className="reveal-label font-sans text-xs font-bold tracking-[0.28em] uppercase text-neutral-500">
              Concept & Objectives
            </h2>
            <p className="reveal-body font-sans text-xl md:text-2xl font-medium leading-[1.35] tracking-[-0.01em] text-[#1a1a1a] max-w-[32ch]">
              {project.story_challenge || project.description}
            </p>
          </div>

          {(project.story_solution || project.story_outcome) && (
            <div className="reveal-section space-y-5">
              <h2 className="reveal-label font-sans text-xs font-bold tracking-[0.28em] uppercase text-neutral-500">
                My Role
              </h2>
              <p className="reveal-body font-sans text-lg md:text-xl text-neutral-600 leading-[1.6]">
                {project.story_solution || project.story_outcome}
              </p>
            </div>
          )}

          <div className="reveal-section space-y-5">
            <h2 className="reveal-label font-sans text-xs font-bold tracking-[0.28em] uppercase text-neutral-500">
              Details
            </h2>
            <div className="reveal-body grid grid-cols-2 gap-8 pt-8 border-t border-neutral-200">
              <div>
                <h3 className="font-sans text-[10px] font-bold tracking-[0.22em] uppercase text-neutral-500 mb-2">
                  Industry
                </h3>
                <p className="font-sans font-semibold text-sm tracking-tight text-[#1a1a1a]">{project.category}</p>
              </div>
              <div>
                <h3 className="font-sans text-[10px] font-bold tracking-[0.22em] uppercase text-neutral-500 mb-2">
                  Release
                </h3>
                {project.link && project.link !== '#' ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 group"
                  >
                    <span className="font-sans font-semibold text-sm tracking-tight text-[#1a1a1a] border-b border-[#1a1a1a] border-opacity-40 group-hover:border-opacity-100 transition-colors">
                      Visit Site
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                ) : (
                  <span className="font-sans font-semibold text-sm tracking-tight text-neutral-400">—</span>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Column: Imagery Gallery */}
        <div className="lg:col-span-7 xl:col-span-8 bg-[#f0f0f2] p-4 md:p-8 lg:p-16 space-y-12">
          {mediaItems.map((item, idx) => (
            <div
              key={idx}
              className="media-card relative w-full aspect-[16/10] bg-white rounded-2xl overflow-hidden shadow-2xl shadow-black/5 group"
            >
              {item.type === 'video' ? (
                <video
                  src={item.url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
                />
              ) : (
                <Image
                  src={item.url}
                  alt={idx === 0 ? project.title : `Gallery ${idx}`}
                  fill
                  className="object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              )}
              <div className="absolute inset-0 border-[1px] border-black/5 rounded-2xl pointer-events-none" />
              {idx === 0 && (
                <div className="absolute bottom-8 left-8 p-3 rounded-full bg-white/90 backdrop-blur shadow-lg md:flex hidden animate-bounce">
                  <ChevronDown className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Footer: Other Work */}
      {otherProjects.length > 0 && (
        <footer className="bg-white border-t border-neutral-200 px-6 md:px-12 py-24">
          <div className="flex items-baseline justify-between mb-16 next-project-heading">
            <h2 className="font-sans text-3xl md:text-4xl font-bold leading-tight tracking-[-0.03em] uppercase text-[#1a1a1a]">
              Next Project
            </h2>
            <Link
              href="/"
              className="font-sans text-xs font-bold tracking-[0.22em] uppercase text-[#1a1a1a] border-b-2 border-[#1a1a1a] pb-1 hover:text-neutral-500 hover:border-neutral-500 transition-colors duration-200"
            >
              View All
            </Link>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-200 border border-neutral-200 overflow-hidden">
            {otherProjects.map((p) => (
              <Link
                key={p.id}
                href={`/work/${p.slug}`}
                className="next-project-card group relative aspect-[4/3] overflow-hidden bg-white p-8 md:p-10 block"
              >
                <div className="absolute inset-0 bg-neutral-100">
                  <Image
                    src={p.src}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover grayscale opacity-60 scale-105 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700"
                  />
                </div>
                <div className="next-card-content relative z-10 h-full flex flex-col justify-between">
                  <span className="next-card-cat font-sans text-[10px] font-bold tracking-[0.32em] uppercase text-neutral-500">
                    {p.category}
                  </span>
                  <div>
                    <h3 className="next-card-title font-sans text-2xl md:text-3xl font-bold leading-tight tracking-[-0.02em] uppercase text-[#1a1a1a] mb-4 transition-transform duration-300 group-hover:-translate-y-1">
                      {p.title}
                    </h3>
                    <div className="next-card-btn w-10 h-10 border-2 border-neutral-300 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-[#1a1a1a] group-hover:text-white group-hover:border-[#1a1a1a]">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </footer>
      )}
      <Footer />
    </div>
  );
}
