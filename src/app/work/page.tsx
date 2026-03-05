'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { getProjects, type Project } from '@/components/work/projectsData';
import Footer from '@/components/Footer';

function getProjectImage(project: Project): string {
  if (project.media?.length) {
    const first = project.media[0];
    if (first.type === 'image') return first.url;
  }
  return project.src || '';
}

// --- Stacked Section Component ---
function StackedSection({
  project,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageUrl = getProjectImage(project);
  const indexStr = String(index + 1).padStart(2, '0');

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Parallax image
  const imageY = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);

  // Scale down + fade as next section covers
  const sectionScale = useTransform(scrollYProgress, [0.8, 1], [1, 0.95]);
  const sectionOpacity = useTransform(scrollYProgress, [0.8, 1], [1, 0.5]);

  const zIndex = index * 10;

  // Letter-by-letter stagger reveal
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: 0.15 },
    },
  };

  const letterVariants: any = {
    hidden: { opacity: 0, y: 80, rotate: 8 },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: { type: 'spring', damping: 18, stiffness: 90 },
    },
  };

  // Build feature list from techStack if available, or a fallback
  const features =
    project.techStack && project.techStack.length > 0
      ? project.techStack.slice(0, 4)
      : [project.category];

  return (
    <motion.section
      ref={sectionRef}
      className="sticky top-0 h-screen w-full bg-white flex flex-col justify-between overflow-hidden origin-top"
      style={{
        zIndex,
        scale: sectionScale,
        opacity: sectionOpacity,
        boxShadow: index > 0 ? '0 -20px 50px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      <div className="container mx-auto px-6 md:px-12 h-full flex flex-col pt-24 pb-8 md:pb-12 relative">
        {/* Massive Typography Heading */}
        <div className="relative w-full flex justify-center mt-auto mb-auto z-20 pointer-events-none">
          <div className="relative flex items-start">
            {/* Section Number */}
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ margin: '-100px' }}
              className="absolute right-full mr-4 md:mr-8 lg:mr-10 top-2 md:top-4 lg:top-6 text-xl md:text-2xl font-medium text-[#1a1a1a] pointer-events-auto"
            >
              {indexStr}
            </motion.span>

            <motion.h2
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ margin: '-20%' }}
              className="serif-font text-[18vw] md:text-[14vw] leading-[0.8] tracking-[-0.04em] text-[#FF2800] m-0 lowercase flex pt-4 pb-4"
            >
              {project.title.split('').map((char, i) => (
                <motion.span
                  key={i}
                  variants={letterVariants}
                  className="inline-block"
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </motion.h2>
          </div>
        </div>

        {/* Content Footer Area (Text + Image) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 mt-auto items-end z-20">
          {/* Left: Description & Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: '-50px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:col-span-5 flex flex-col justify-end pb-4 md:pb-0"
          >
            <p className="text-base md:text-lg lg:text-xl font-medium leading-relaxed mb-8 md:mb-12 text-gray-800 max-w-md">
              {project.introduction}
            </p>

            <div className="w-full h-[1px] bg-gray-200 mb-6" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs md:text-sm font-semibold tracking-wide uppercase text-gray-900">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="hover:text-[#FF2800] transition-colors cursor-default"
                >
                  {feature}
                </div>
              ))}
            </div>

            {/* View Project Button */}
            {project.slug && (
              <motion.div className="mt-10">
                <Link
                  href={`/work/${project.slug}`}
                  className="view-project-btn group relative inline-flex items-center self-start h-12 md:h-14 rounded-full overflow-hidden"
                >
                  {/* Background layer — red, with a black sweep on hover */}
                  <span className="absolute inset-0 bg-[#FF2800] rounded-full" />
                  <span className="absolute inset-0 bg-[#1a1a1a] rounded-full origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]" />

                  {/* Text */}
                  <span className="relative z-10 text-white text-xs md:text-sm font-bold tracking-widest uppercase pl-8 pr-2 group-hover:pl-7 transition-all duration-500 ease-out">
                    View Project
                  </span>

                  {/* Arrow circle */}
                  <span className="relative z-10 flex items-center justify-center w-8 h-8 md:w-10 md:h-10 mr-1.5 md:mr-2 rounded-full bg-white/20 group-hover:bg-white transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110">
                    <svg
                      className="w-3.5 h-3.5 md:w-4 md:h-4 text-white group-hover:text-[#1a1a1a] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 12h16m0 0l-6-6m6 6l-6 6"
                      />
                    </svg>
                  </span>
                </Link>
              </motion.div>
            )}
          </motion.div>

          {/* Right: Parallax Image — clickable with arrow overlay */}
          <Link
            href={project.slug ? `/work/${project.slug}` : '#'}
            className="hidden md:block md:col-span-7 h-[30vh] sm:h-[35vh] lg:h-[45vh] w-full relative overflow-hidden bg-gray-50 group cursor-pointer"
          >
            <motion.div
              style={{ y: imageY }}
              className="absolute w-full h-[130%] -top-[15%] left-0"
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
              )}
              {/* Darken overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
            </motion.div>

            {/* Diagonal arrow — appears on hover */}
            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-xl">
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 text-[#1a1a1a] -rotate-45"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 12h16m0 0l-6-6m6 6l-6 6"
                  />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </motion.section>
  );
}

// --- Main Work Page ---
export default function WorkPage() {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#121212] border-t-transparent rounded-full animate-spin" />
          <p className="serif-font italic text-sm text-[#1a1a1a]/50">Loading</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900 selection:bg-[#FF2800] selection:text-white">
      {/* Navbar is provided by the root layout */}

      <main className="relative bg-white">
        {/* Intro — scroll hint */}
        <div className="h-[20vh] w-full flex items-center justify-center bg-white">
          <p className="serif-font italic text-sm text-gray-400 animate-pulse">
            Scroll Down
          </p>
        </div>

        {/* Stacking Sections */}
        {projects.length === 0 ? (
          <div className="min-h-[50vh] flex items-center justify-center">
            <p className="text-[#1a1a1a]/60 serif-font italic">
              No projects yet.
            </p>
          </div>
        ) : (
          projects.map((project, index) => (
            <StackedSection
              key={project.id}
              project={project}
              index={index}
              total={projects.length}
            />
          ))
        )}

        {/* Spacer before footer so last section unsticks cleanly */}
        <div className="h-screen" />
      </main>

      <Footer />
    </div>
  );
}