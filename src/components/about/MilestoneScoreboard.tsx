"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Milestone } from "@/lib/milestonesData";

const DESKTOP_BREAKPOINT = 768;

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= DESKTOP_BREAKPOINT : true
  );
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isDesktop;
}

const F1Logo = () => (
  <svg viewBox="0 0 100 25" className="h-6 w-auto fill-current text-white">
    <path d="M28.6,12.7h11.2l-3.6,4.3h-11L28.6,12.7z M43.4,0H12.9C11.5,0,10.2,0.8,9.6,2.1L0.2,24.6h12.6l4.2-10h14.7l-2.4,5.7h-8.7l-1.8,4.3h22.6c1.4,0,2.7-0.8,3.3-2.1l6.3-15L56.8,0H43.4z M83.5,0h16.2l-2.6,6.2H86.2L83.5,0z M73.7,0H57.5l-2.6,6.2h16.2L73.7,0z" />
  </svg>
);

const CheckeredFlag = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current text-white/20">
    <path d="M2 2h20v20H2z" fill="none" />
    <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z" />
  </svg>
);

const MILESTONE_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

function getMilestoneColor(index: number) {
  return MILESTONE_COLORS[index % MILESTONE_COLORS.length];
}

const CheckIcon = () => (
  <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0" fill="currentColor">
    <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z" />
  </svg>
);

interface MilestoneRowProps {
  milestone: Milestone;
  index: number;
  isActive: boolean;
  isVisited: boolean;
  onClick: () => void;
}

const MilestoneRow = React.memo(function MilestoneRow({ milestone, index, isActive, isVisited, onClick }: MilestoneRowProps) {
  const rowRef = useRef<HTMLButtonElement>(null);
  const pos = index + 1;
  const color = getMilestoneColor(index);
  const shortTitle =
    milestone.title.length > 20 ? milestone.title.slice(0, 20) + "…" : milestone.title;

  useEffect(() => {
    if (rowRef.current && typeof window !== "undefined" && (window as unknown as { gsap?: unknown }).gsap) {
      const gsap = (window as unknown as { gsap: { fromTo: (t: unknown, from: object, to: object) => void } }).gsap;
      gsap.fromTo(
        rowRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, delay: index * 0.05, ease: "power2.out" }
      );
    }
  }, [index]);

  return (
    <button
      ref={rowRef}
      type="button"
      onClick={onClick}
      className={`
        group relative flex items-center w-full h-12 px-4 mb-[2px] rounded-r-md transition-all duration-300
        text-left border-l-4 overflow-hidden
        ${isActive
          ? "bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg translate-x-1"
          : "bg-gray-900/40 hover:bg-gray-800/60 hover:pl-5 border-transparent"}
      `}
      style={{
        borderLeftColor: isActive ? color : "transparent",
      }}
    >
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div
        className={`
          w-8 font-bold text-xl text-right mr-4 transition-colors shrink-0
          ${isActive ? "text-white" : "text-gray-500 group-hover:text-gray-300"}
        `}
      >
        {pos}
      </div>

      <div
        className={`h-4 w-1.5 rounded-full mr-4 shrink-0 transition-all ${isActive ? "scale-110" : "opacity-70"}`}
        style={{
          backgroundColor: color,
          boxShadow: isActive ? `0 0 10px ${color}` : "none",
        }}
      />

      <div className="flex-1 min-w-0 flex items-baseline justify-between gap-2">
        <div
          className={`
            font-bold text-lg tracking-wide truncate transition-colors
            ${isActive ? "text-white" : "text-gray-300"}
          `}
        >
          {shortTitle}
        </div>
        <div
          className={`
            font-mono text-sm tracking-wider shrink-0 transition-colors
            ${isActive ? "text-gray-300" : "text-gray-500"}
          `}
        >
          {milestone.year}
        </div>
      </div>

      {isVisited && !isActive && (
        <div className="ml-2 text-emerald-400/80 shrink-0" title="Visited">
          <CheckIcon />
        </div>
      )}
      {isActive && (
        <div className="ml-3 text-white/50 shrink-0">
          <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </button>
  );
});

export interface MilestoneScoreboardProps {
  milestones: Milestone[];
  activeMarkerIndex: number;
  carProgress: number;
  visitedMilestoneIndices: Set<number>;
  onSelectMilestone: (index: number) => void;
  isOpen?: boolean;
  onToggleOpen?: () => void;
}

export function MilestoneScoreboard({
  milestones,
  activeMarkerIndex,
  carProgress,
  visitedMilestoneIndices,
  onSelectMilestone,
  isOpen = true,
  onToggleOpen,
}: MilestoneScoreboardProps) {
  const isDesktop = useIsDesktop();
  const n = milestones.length;
  const fromProgress = Math.max(0, Math.min(n - 1, Math.floor(carProgress * (n + 1)) - 1));
  const activeIndex =
    activeMarkerIndex >= 0 ? activeMarkerIndex : (fromProgress >= 0 ? fromProgress : 0);
  const activeMilestone = milestones[activeIndex];

  const showAll = isDesktop;
  const nextIndex = activeIndex < n - 1 ? activeIndex + 1 : null;
  const visibleIndices = showAll
    ? milestones.map((_, i) => i)
    : nextIndex !== null ? [activeIndex, nextIndex] : [activeIndex];
  const visibleMilestones = visibleIndices.map((i) => ({ index: i, milestone: milestones[i] }));

  const showTrigger = !isDesktop && onToggleOpen && !isOpen;
  const showClose = !isDesktop && onToggleOpen;

  return (
    <div className={`about-scoreboard about-scoreboard--${isDesktop ? "desktop" : "mobile"} ${isOpen ? "about-scoreboard--open" : "about-scoreboard--closed"}`}>
      {showTrigger && (
        <button
          type="button"
          onClick={onToggleOpen}
          className="about-scoreboard-trigger"
          aria-label="Open milestones"
        >
          <F1Logo />
          <span className="about-scoreboard-trigger-label">MILESTONES</span>
          <ChevronUp className="about-scoreboard-trigger-icon" />
        </button>
      )}
      <div className="about-scoreboard-panel glass-panel rounded-t-3xl overflow-hidden pb-4">
        <div className="pt-4 pb-2 px-4 sm:pt-6 sm:pb-2 sm:px-6 bg-gradient-to-b from-gray-800/80 to-transparent">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col items-center justify-center opacity-90 shrink-0">
              <F1Logo />
            </div>
            <div className="flex-1 flex justify-between items-end border-b border-gray-600/50 pb-2 min-w-0">
              <div className="text-red-500 font-bold tracking-widest text-xs animate-pulse flex items-center gap-1 shrink-0">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                LIVE
              </div>
              <h2 className="text-base sm:text-xl font-bold tracking-[0.15em] sm:tracking-[0.2em] text-gray-100 truncate">
                MILESTONES
              </h2>
              <div className="flex items-center gap-2 shrink-0">
                <div className="text-gray-400 font-mono text-xs text-right hidden sm:block">
                  <div>Stops</div>
                  <span className="text-white font-bold text-base">{milestones.length}</span>
                </div>
                {showClose && (
                  <button
                    type="button"
                    onClick={onToggleOpen}
                    className="about-scoreboard-close"
                    aria-label="Close milestones"
                  >
                    <ChevronDown size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-3 pt-3 sm:pt-4 flex flex-col pb-2 about-scoreboard-list">
          {visibleMilestones.map(({ index, milestone }) => (
            <MilestoneRow
              key={milestone.id}
              milestone={milestone}
              index={index}
              isActive={activeIndex === index}
              isVisited={visitedMilestoneIndices.has(index)}
              onClick={() => onSelectMilestone(index)}
            />
          ))}
        </div>

        {activeMilestone && (
          <div className="mx-3 sm:mx-4 mt-2 p-3 sm:p-4 rounded-xl bg-black/20 border border-white/5 transition-all duration-300">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-xs text-gray-500 font-bold tracking-widest uppercase mb-1">
                  Current Focus
                </div>
                <div className="text-white font-bold text-base sm:text-lg leading-tight truncate">
                  {activeMilestone.title}
                </div>
              </div>
              <div className="text-xl sm:text-2xl opacity-20 shrink-0">
                <CheckeredFlag />
              </div>
            </div>
            <div className="mt-2 text-xs sm:text-sm text-gray-400 leading-relaxed border-t border-white/5 pt-2 line-clamp-2">
              {activeMilestone.description}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
