'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import gsap from 'gsap';
import { getProjectBySlug, getOtherProjects, type Project } from '@/components/work/projectsData';

function ProjectDetail({
  project,
  otherProjects,
  onBack,
}: {
  project: Project;
  otherProjects: Project[];
  onBack: () => void;
}) {
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project || !detailRef.current) return;

    const tl = gsap.timeline();
    tl.fromTo(detailRef.current, { opacity: 0 }, { opacity: 1, duration: 1 });
    tl.fromTo(
      '.det-stagger',
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, stagger: 0.1, ease: 'expo.out' },
      '-=0.5'
    );
    tl.fromTo(
      '.det-img-reveal',
      { clipPath: 'inset(100% 0% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.8, ease: 'power4.inOut' },
      '-=1.2'
    );
  }, [project]);

  const mediaItems =
    project.media && project.media.length > 0
      ? project.media
      : [{ type: 'image' as const, url: project.src }];
  const techList = project.techStack ?? [];

  return (
    <div
      ref={detailRef}
      className="bg-[#FBFBFA] text-[#1a1a1a] min-h-screen pb-60 relative"
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&family=Inter:wght@300;400;700;900&display=swap"
        rel="stylesheet"
      />

      <div className="max-w-7xl mx-auto px-8 md:px-12 pt-8 md:pt-10">
        <header className="mb-24 relative z-30">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-end">
            <div className="md:col-span-7 relative z-10 min-w-0">
              {project.subtitle && (
                <p className="det-stagger text-[#FF2800] font-bold text-[10px] tracking-[0.5em] uppercase mb-4 font-sans">
                  {project.subtitle}
                </p>
              )}
              <div className="det-stagger">
                {(() => {
                  const words = project.title.trim().split(/\s+/);
                  const lastWord = words[words.length - 1];
                  const rest = words.slice(0, -1);
                  return (
                    <>
                      {rest.length > 0 && (
                        <div className="overflow-hidden">
                          <h1 className="text-7xl md:text-9xl serif-font font-medium leading-[0.9] tracking-tight text-[#1a1a1a]">
                            {rest.map((w, i) => (
                              <span key={i}>
                                {i > 0 ? ' ' : ''}
                                <span className={i === rest.length - 1 ? 'italic' : ''}>{w}</span>
                              </span>
                            ))}
                          </h1>
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <h1 className="text-7xl md:text-9xl serif-font font-medium leading-[0.9] tracking-tight text-[#FF2800]">
                          {lastWord}
                        </h1>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
            <div className="md:col-span-5 pb-2 relative z-20">
              <div className="det-stagger border-l border-[#FF2800] pl-6">
                <p className="text-sm font-normal text-[#1a1a1a]/70 leading-relaxed italic serif-font tracking-wide max-w-md">
                  {project.description}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="det-img-reveal aspect-[21/9] bg-white overflow-hidden mb-60 mt-4 md:mt-8 shadow-sm border border-black/[0.03] relative z-0">
          <img src={project.src} className="w-full h-full object-cover" alt="" />
        </div>

        <div className={`grid grid-cols-1 gap-24 mb-60 ${techList.length > 0 ? 'md:grid-cols-12' : ''}`}>
          {techList.length > 0 && (
            <div className="md:col-span-4 space-y-24">
              <div className="det-stagger">
                <h4 className="font-sans text-[10px] font-bold text-black/20 uppercase mb-8 tracking-[0.3em]">
                  Stack Archive
                </h4>
                <div className="flex flex-wrap gap-4">
                  {techList.map((t) => (
                    <span
                      key={t}
                      className="px-4 py-2 border border-black/5 font-sans text-[9px] font-bold tracking-widest uppercase"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className={`${techList.length > 0 ? 'md:col-span-8' : ''} space-y-24`}>
            {project.story_challenge && (
              <div className="det-stagger group">
                <h2 className="text-[#FF2800] text-[9px] font-bold uppercase tracking-[0.5em] mb-6 font-sans">
                  01 / The Obstacle
                </h2>
                <p className="text-lg md:text-xl serif-font font-medium text-[#1a1a1a]/90 leading-relaxed max-w-2xl">
                  {project.story_challenge}
                </p>
              </div>
            )}
            {project.story_solution && (
              <div className="det-stagger group">
                <h2 className="text-[#FF2800] text-[9px] font-bold uppercase tracking-[0.5em] mb-6 font-sans">
                  02 / The Solution
                </h2>
                <p className="text-lg md:text-xl serif-font font-medium text-[#1a1a1a]/90 leading-relaxed max-w-2xl">
                  {project.story_solution}
                </p>
              </div>
            )}
            {project.story_outcome && (
              <div className="det-stagger group">
                <h2 className="text-[#FF2800] text-[9px] font-bold uppercase tracking-[0.5em] mb-6 font-sans">
                  03 / The Impact
                </h2>
                <p className="text-lg md:text-xl serif-font font-medium text-[#1a1a1a]/90 leading-relaxed max-w-2xl">
                  {project.story_outcome}
                </p>
              </div>
            )}
          </div>
        </div>

        {mediaItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mediaItems.map((m, i) => (
              <div
                key={i}
                className={`det-stagger overflow-hidden bg-[#eee] shadow-xl ${
                  i % 3 === 0 ? 'md:col-span-2 aspect-[16/7]' : 'aspect-[4/5]'
                }`}
              >
                {m.type === 'video' ? (
                  <video
                    src={m.url}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-[3s] ease-out"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <img
                    src={m.url}
                    alt=""
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-[3s] ease-out"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {otherProjects.length > 0 && (
          <section className="mt-60 mb-40">
            <h2 className="text-[10px] serif-font font-semibold tracking-[0.35em] uppercase text-black/20 mb-12">
              Other Projects
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {otherProjects.map((p) => (
                <Link
                  key={p.id}
                  href={`/work/${p.slug}`}
                  className="group block overflow-hidden bg-[#FBFBFA] border border-black/10 hover:border-[#FF2800]/40 transition-all duration-300"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-[#eee]">
                    <img
                      src={p.src}
                      alt={p.title}
                      className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 scale-105 group-hover:scale-110 transition-all duration-500"
                    />
                  </div>
                  <div className="p-6 border-t border-black/5">
                    <span className="text-[10px] serif-font font-semibold tracking-[0.2em] uppercase text-[#FF2800]">
                      {p.category}
                    </span>
                    <h3 className="mt-3 text-xl serif-font font-bold tracking-tight leading-tight text-[#121212] group-hover:text-[#FF2800] transition-colors">
                      {p.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link
                href="/work"
                className="text-[10px] serif-font font-semibold tracking-[0.35em] uppercase text-black/50 hover:text-[#FF2800] transition-colors"
              >
                View all work
              </Link>
            </div>
          </section>
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `.serif-font { font-family: 'Playfair Display', serif; }`,
        }}
      />
    </div>
  );
}

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [otherProjects, setOtherProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!slug) return;
      setLoading(true);
      const [current, others] = await Promise.all([
        getProjectBySlug(slug as string),
        getOtherProjects(slug as string, 4),
      ]);
      setProject(current ?? null);
      setOtherProjects(others);
      setLoading(false);
    };
    loadData();
  }, [slug]);

  const onBack = () => router.push('/work');

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#FBFBFA] flex items-center justify-center z-[100]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin" />
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase">
            Loading
          </p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#FBFBFA] flex flex-col items-center justify-center text-neutral-900">
        <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
        <Link
          href="/work"
          className="text-neutral-600 hover:text-red-600 transition-colors underline"
        >
          Back to Work
        </Link>
      </div>
    );
  }

  return (
    <ProjectDetail
      project={project}
      otherProjects={otherProjects}
      onBack={onBack}
    />
  );
}
