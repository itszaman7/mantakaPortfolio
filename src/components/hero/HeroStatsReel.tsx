"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";
import { getHeroStats, statsSlidesFallback, type StatsSlide } from "./heroStatsData";

const BackgroundGhostReel = ({ activeIndex, slides }: { activeIndex: number; slides: StatsSlide[] }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center -z-10">
    <motion.div
      animate={{
        y: `calc(50% - ${activeIndex * 40}vh - 20vh)`,
      }}
      transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
      className="flex flex-col items-center opacity-[0.04]"
    >
      {slides.map((slide) => (
        <div
          key={slide.id}
          className="h-[40vh] flex items-center justify-center"
        >
          <span className="text-[40vh] font-black leading-none font-sans text-neutral-900 whitespace-nowrap">
            {slide.highlight}
          </span>
        </div>
      ))}
    </motion.div>
  </div>
);

const HeroCard = ({ image, highlight, suffix }: { image: string; highlight: string; suffix: string }) => {
  const [isHovered, setHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // --- Tilt Physics (Mouse movement) ---
  const tiltSpring = { damping: 20, stiffness: 150, mass: 0.8 };
  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [8, -8]),
    tiltSpring
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-8, 8]),
    tiltSpring
  );

  const containerScale = useSpring(
    useTransform(useMotionValue(isHovered ? 1 : 0), [0, 1], [1, 1.05]),
    { damping: 15, stiffness: 150 }
  );

  useEffect(() => {
    containerScale.set(isHovered ? 1.05 : 1);
  }, [isHovered, containerScale]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const x = (e.clientX - rect.left - w / 2) / (w / 2);
    const y = (e.clientY - rect.top - h / 2) / (h / 2);
    mouseX.set(x);
    mouseY.set(y);
  };

  // --- Animation Variants ---
  const flapVariants = {
    closed: {
      rotateX: 0,
      z: 40,
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const,
        delay: 0.3,
      },
    },
    open: {
      rotateX: 180,
      z: 40,
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const,
        delay: 0,
      },
    },
  };

  const cardVariants = {
    closed: {
      y: 0,
      z: 1,
      rotateX: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const,
        delay: 0,
      },
    },
    open: {
      y: "-120%",
      z: 60,
      rotateX: 5,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const,
        delay: 0.2,
      },
    },
  };

  return (
    <div
      className="relative z-10 w-full max-w-[500px] aspect-[16/11] cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setHovered(false);
        mouseX.set(0);
        mouseY.set(0);
      }}
      style={{ perspective: 1500 }}
    >
      <motion.div
        className="w-full h-full relative"
        style={{
          rotateX,
          rotateY,
          scale: containerScale,
          transformStyle: "preserve-3d",
        }}
      >
        {/* --- ENVELOPE BACK --- */}
        <div
          className="absolute inset-0 bg-[#f0f0f0] rounded-lg shadow-2xl border border-neutral-200"
          style={{ transform: "translateZ(-10px)" }}
        />

        {/* --- ENVELOPE INSIDE --- */}
        <div
          className="absolute inset-2 bg-neutral-200 rounded-md"
          style={{ transform: "translateZ(-5px)" }}
        />

        {/* --- THE CARD / IMAGE --- */}
        <motion.div
          className="absolute left-3 right-3 bottom-3 top-6 rounded-lg overflow-hidden bg-white shadow-md border-[4px] border-white z-10"
          variants={cardVariants}
          initial="closed"
          animate={isHovered ? "open" : "closed"}
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          <img
            src={image}
            alt="Feature"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
        </motion.div>

        {/* --- ENVELOPE FRONT POCKET --- */}
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            transform: "translateZ(20px)",
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="absolute inset-0 bg-[#fafafa] rounded-b-lg"
            style={{
              clipPath: "polygon(0% 0%, 50% 40%, 100% 0%, 100% 100%, 0% 100%)",
              filter: "drop-shadow(0px -4px 6px rgba(0,0,0,0.05))",
            }}
          />
          <div
            className="absolute inset-0 opacity-50 mix-blend-multiply pointer-events-none"
            style={{
              clipPath: "polygon(0% 0%, 50% 40%, 100% 0%, 100% 100%, 0% 100%)",
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* --- ENVELOPE FLAP --- */}
        <motion.div
          className="absolute inset-0 z-30 pointer-events-none"
          variants={flapVariants}
          initial="closed"
          animate={isHovered ? "open" : "closed"}
          style={{
            transformOrigin: "top",
            transformStyle: "preserve-3d",
            z: 40,
          }}
        >
          <div
            className="absolute inset-0 bg-white rounded-t-lg"
            style={{
              clipPath: "polygon(0% 0%, 100% 0%, 50% 45%)",
              filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.08))",
              backfaceVisibility: "hidden",
            }}
          />
          <div
            className="absolute inset-0 opacity-50 mix-blend-multiply pointer-events-none"
            style={{
              clipPath: "polygon(0% 0%, 100% 0%, 50% 45%)",
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
            }}
          />
        </motion.div>

        {/* --- DECORATIVE NUMBER --- */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-40"
          style={{ transform: "translateZ(80px)" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={highlight}
              initial={{ y: 12, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -12, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex items-baseline drop-shadow-2xl"
            >
              <span className="text-[4rem] md:text-[5.5rem] font-bold leading-none tracking-tighter text-red-600 drop-shadow-lg whitespace-nowrap">
                {highlight}
              </span>
              {suffix && (
                <span className="text-xl md:text-3xl font-medium text-neutral-400 ml-2 drop-shadow-sm whitespace-nowrap">
                  {suffix}
                </span>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

const VH_PER_SLIDE = 65;
const VH_EXTRA_END = 40; // Extra scroll at end so the last slide is reachable

export default function HeroStatsReel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [slides, setSlides] = useState<StatsSlide[]>(statsSlidesFallback);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    getHeroStats().then(setSlides);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Overlay fades in at start, stays full until near end, then fades out so next section doesn't appear before card is gone
  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 0.002, 0.96, 1],
    [0, 1, 1, 0]
  );

  // Hysteresis at boundaries so slide changes are consistent (same scroll distance each time, no delayed switch when smooth scroll catches up)
  const prevIndexRef = useRef(0);
  const HYST = 0.045; // dead zone: must scroll past boundary by this much to switch

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const n = slides.length;
      if (n === 0) return;
      const prev = prevIndexRef.current;
      const progress = Math.max(0, Math.min(1, latest));
      const segment = Math.min(Math.floor(progress * n), n - 1);

      let next = prev;
      if (segment > prev) {
        next = progress >= (prev + 1) / n - HYST ? segment : prev;
      } else if (segment < prev) {
        next = progress <= prev / n + HYST ? segment : prev;
      }
      if (next !== prev) {
        prevIndexRef.current = next;
        setActiveIndex(next);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, slides.length]);

  useEffect(() => {
    prevIndexRef.current = Math.min(activeIndex, Math.max(0, slides.length - 1));
  }, [activeIndex, slides.length]);

  const currentSlide = slides[activeIndex];

  if (!currentSlide) return null;

  const sectionHeightVh = slides.length * VH_PER_SLIDE + VH_EXTRA_END;

  return (
    <div
      ref={containerRef}
      style={{ minHeight: `${sectionHeightVh}vh`, height: `${sectionHeightVh}vh` }}
      className="relative w-full bg-neutral-50"
    >
      {/* Fixed overlay: pointer-events none so scroll works; only inner content captures hover/click */}
      <motion.div
        className="fixed inset-0 z-0 overflow-hidden flex items-center justify-center bg-neutral-50 pointer-events-none"
        style={{ opacity: overlayOpacity }}
      >
        <BackgroundGhostReel activeIndex={activeIndex} slides={slides} />

        <div className="relative z-10 max-w-[1200px] mx-auto w-full px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center min-h-0 flex-1 pointer-events-auto">
          {/* Left Text */}
          <div className="md:col-span-4 text-center md:text-left order-2 md:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.title}
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -12, opacity: 0 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <h2 className="text-4xl lg:text-6xl font-bold tracking-tight text-neutral-900 mb-2">
                  {currentSlide.title}
                </h2>
                <p className="text-xl text-neutral-500 font-medium">
                  {currentSlide.subtitle}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Center Envelope */}
          <div className="md:col-span-4 flex justify-center order-1 md:order-2 py-8 md:py-0">
            <HeroCard
              image={currentSlide.image}
              highlight={currentSlide.highlight}
              suffix={currentSlide.suffix}
            />
          </div>

          {/* Right Text */}
          <div className="md:col-span-4 text-center md:text-right order-3 flex flex-col items-center md:items-end">
            <div className="max-w-[300px]">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentSlide.description}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="text-neutral-600 leading-relaxed font-medium"
                >
                  {currentSlide.description}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}