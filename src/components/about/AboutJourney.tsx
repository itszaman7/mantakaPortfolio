"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useLenis } from "lenis/react";
import { ChevronDown, Download, Linkedin, Github, RotateCcw } from "lucide-react";
import { ScrollDriveProvider, useScrollDrive, INITIAL_CAR_PROGRESS } from "./ScrollDriveContext";
import { getStartFinishT } from "./trackCurve";
import { MilestoneScoreboard } from "./MilestoneScoreboard";
import type { Milestone } from "@/lib/milestonesData";
import "./about-drive.css";

const Canvas = dynamic(
  () => import("@react-three/fiber").then((m) => m.Canvas),
  { ssr: false }
);
const TrackScene = dynamic(() => import("./TrackScene").then((m) => ({ default: m.TrackScene })), {
  ssr: false,
});

const PIXELS_PER_MOVE = 1500;

function getTrackPositions(length: number): number[] {
  if (length <= 0) return [];
  if (length === 1) return [0.5];
  const positions: number[] = [];
  for (let i = 0; i < length; i++) {
    positions.push((i + 1) / (length + 1));
  }
  return positions;
}

function ScrollLogic({
  milestones,
  totalHeight,
  scrollContentHeight,
  sectionTopRef,
}: {
  milestones: Milestone[];
  totalHeight: number;
  scrollContentHeight: number;
  sectionTopRef: React.RefObject<HTMLElement | null>;
}) {
  const {
    setCarProgress,
    setActiveMarkerIndex,
    addVisitedMilestone,
    setJourneyFinished,
    setCarAtGarage,
    journeyFinished,
    replayTrigger,
  } = useScrollDrive();
  const n = milestones.length;
  const endTriggeredRef = React.useRef(false);
  const lastVisitedRef = React.useRef(-1);

  useEffect(() => {
    endTriggeredRef.current = false;
  }, [replayTrigger]);

  const prevProgressRef = React.useRef<number>(-1);
  const prevNearestRef = React.useRef<number>(-2);
  const rafRef = React.useRef<number>(0);

  useEffect(() => {
    const runScroll = () => {
      const scrollY = window.scrollY ?? document.documentElement.scrollTop;
      if (totalHeight <= 0) return;
      if (journeyFinished) return;

      const sectionTop = sectionTopRef.current
        ? sectionTopRef.current.getBoundingClientRect().top + (window.scrollY ?? document.documentElement.scrollTop)
        : 0;
      const effectiveScroll = Math.max(0, Math.min(scrollY - sectionTop, totalHeight));

      if (effectiveScroll <= 0) {
        setCarProgress(INITIAL_CAR_PROGRESS);
        setActiveMarkerIndex(-1);
        prevProgressRef.current = INITIAL_CAR_PROGRESS;
        prevNearestRef.current = -1;
        rafRef.current = 0;
        return;
      }

      let currentTrackP = 0;
      for (let i = 0; i <= n; i++) {
        const segmentStart = i * PIXELS_PER_MOVE;
        const segmentEnd = (i + 1) * PIXELS_PER_MOVE;
        const prevTrackPos = i === 0 ? INITIAL_CAR_PROGRESS : i / (n + 1);
        const nextTrackPos = (i + 1) / (n + 1);
        if (effectiveScroll < segmentEnd) {
          const localProgress = Math.min(1, (effectiveScroll - segmentStart) / PIXELS_PER_MOVE);
          currentTrackP = prevTrackPos + localProgress * (nextTrackPos - prevTrackPos);
          break;
        }
      }

      const progress = Math.min(1, currentTrackP);

      let nearest = 0;
      let minDist = 1;
      for (let i = 0; i < n; i++) {
        const trackPos = (i + 1) / (n + 1);
        const d = Math.abs(progress - trackPos);
        const wrap = Math.min(d, 1 - d);
        if (wrap < minDist) {
          minDist = wrap;
          nearest = i;
        }
      }

      if (progress !== prevProgressRef.current) {
        prevProgressRef.current = progress;
        setCarProgress(progress);
      }
      if (nearest !== prevNearestRef.current) {
        prevNearestRef.current = nearest;
        setActiveMarkerIndex(nearest);
        if (nearest >= 0 && nearest !== lastVisitedRef.current) {
          lastVisitedRef.current = nearest;
          addVisitedMilestone(nearest);
        }
      }
      if (nearest < 0) lastVisitedRef.current = -1;

      if (effectiveScroll >= totalHeight - 5 && !endTriggeredRef.current) {
        endTriggeredRef.current = true;
        setActiveMarkerIndex(-1);
        setJourneyFinished(true);
        // Animate car from end-of-lap (t=0, same as t=1) to stop line over 800ms so it drives there instead of teleporting
        const stopT = getStartFinishT();
        const duration = 800;
        const startTime = performance.now();
        const tick = () => {
          const elapsed = performance.now() - startTime;
          const t = Math.min(1, elapsed / duration);
          const eased = 1 - (1 - t) * (1 - t); // ease out
          setCarProgress(0 + eased * stopT);
          if (elapsed < duration) requestAnimationFrame(tick);
          else setCarAtGarage(true);
        };
        requestAnimationFrame(tick);
      }
      rafRef.current = 0;
    };

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(runScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    runScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [n, totalHeight, scrollContentHeight, journeyFinished, replayTrigger, sectionTopRef, setCarProgress, setActiveMarkerIndex, addVisitedMilestone, setJourneyFinished, setCarAtGarage]);

  return null;
}

const NEAR_THRESHOLD = 0.07;

function OverlayMarkers({
  milestones,
  trackPositions,
  expandedIndex,
  onToggleExpand,
  onMinimize,
}: {
  milestones: Milestone[];
  trackPositions: number[];
  expandedIndex: number;
  onToggleExpand: (index: number) => void;
  onMinimize: (e: React.MouseEvent, index: number) => void;
}) {
  const { markerScreenPositions, activeMarkerIndex, carProgress } = useScrollDrive();

  return (
    <>
      {milestones.map((milestone, index) => {
        const pos = markerScreenPositions[index] ?? { x: 0, y: 0, visible: false };
        const trackPos = trackPositions[index] ?? 0;
        const dist = Math.abs(carProgress - trackPos);
        const distWrap = Math.min(dist, 1 - dist);
        const isNear = distWrap < NEAR_THRESHOLD;
        const isExpanded = expandedIndex === index;
        const teaser =
          milestone.description.length > 50
            ? milestone.description.substring(0, 50) + "..."
            : milestone.description;
        const thumb = milestone.images?.[0];

        return (
          <div
            key={milestone.id}
            id={`marker-${index}`}
            className={`scroll-marker ${activeMarkerIndex === index ? "active" : ""} ${isNear ? "near" : ""} ${isExpanded ? "expanded" : ""}`}
            style={{
              display: !isExpanded ? "flex" : "flex",
              visibility: !isExpanded && !pos.visible ? "hidden" : "visible",
              transform: isExpanded
                ? undefined
                : `translate(${pos.x}px, ${pos.y}px) translate(-50%, -100%)`,
            }}
            onClick={(e) => {
              if ((e.target as HTMLElement).closest(".card-content")) return;
              onToggleExpand(index);
            }}
          >
            <div className="marker-preview">
              <div className="marker-preview-image-wrap">
                {thumb ? (
                  <img src={thumb} alt="" className="marker-preview-image" />
                ) : (
                  <div className="marker-preview-image-placeholder" />
                )}
                <div className="marker-preview-overlay" />
              </div>
              <div className="marker-preview-content">
                <div className="marker-title">{milestone.title}</div>
                <div className="marker-teaser">{teaser}</div>
                <button type="button" className="marker-preview-btn" onClick={(e) => { e.stopPropagation(); onToggleExpand(index); }}>
                  View story
                </button>
              </div>
            </div>
            <div className="marker-line" />

            <div className="card-content">
              <div className="gallery-container">
                <div className="gallery-track">
                  {(milestone.images ?? []).map((img, i) => (
                    <div key={i} className="gallery-item">
                      <img src={img} alt={`${milestone.title} ${i + 1}`} />
                      <div className="gallery-caption">Fig {i + 1}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card-body">
                <div className="tech-line" />
                <h2>{milestone.title}</h2>
                <p>{milestone.description}</p>
                <button
                  type="button"
                  className="btn-minimize"
                  onClick={(e) => onMinimize(e, index)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

function ScrollInstruction() {
  const { carAtGarage } = useScrollDrive();
  if (carAtGarage) return null;
  return (
    <div className="scroll-instruction">
      <ChevronDown className="w-4 h-4 shrink-0" size={14} />
      <span>Scroll to drive</span>
    </div>
  );
}

function scrollOffsetForMilestone(index: number, pixelsPerMove: number): number {
  return (index + 1) * pixelsPerMove + 80;
}

function MilestoneScoreboardWrapper({
  milestones,
  pixelsPerMove,
  sectionTopRef,
}: {
  milestones: Milestone[];
  pixelsPerMove: number;
  sectionTopRef: React.RefObject<HTMLElement | null>;
}) {
  const [scoreboardOpen, setScoreboardOpen] = useState(true);
  const lenis = useLenis();
  const { setJourneyFinished, setCarAtGarage, activeMarkerIndex, carProgress, visitedMilestoneIndices } = useScrollDrive();

  const onSelectMilestone = (index: number) => {
    setJourneyFinished(false);
    setCarAtGarage(false);
    const sectionTop = sectionTopRef.current
      ? sectionTopRef.current.getBoundingClientRect().top + (window.scrollY ?? document.documentElement.scrollTop)
      : 0;
    const targetY = sectionTop + scrollOffsetForMilestone(index, pixelsPerMove);
    if (lenis) lenis.scrollTo(targetY, { lerp: 0.12 });
    else window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  return (
    <MilestoneScoreboard
      milestones={milestones}
      activeMarkerIndex={activeMarkerIndex}
      carProgress={carProgress}
      visitedMilestoneIndices={visitedMilestoneIndices}
      onSelectMilestone={onSelectMilestone}
      isOpen={scoreboardOpen}
      onToggleOpen={() => setScoreboardOpen((o) => !o)}
    />
  );
}

const LINKEDIN_URL = "https://linkedin.com/in/mantaka";
const GITHUB_URL = "https://github.com/itszaman7";
const CV_URL = "/cv.pdf";

function EndOverlay({ sectionTopRef }: { sectionTopRef: React.RefObject<HTMLElement | null> }) {
  const { carAtGarage, setJourneyFinished, setCarAtGarage, triggerReplay } = useScrollDrive();
  const lenis = useLenis();

  const onReplay = () => {
    setJourneyFinished(false);
    setCarAtGarage(false);
    triggerReplay();
    const sectionTop = sectionTopRef.current
      ? sectionTopRef.current.getBoundingClientRect().top + (window.scrollY ?? document.documentElement.scrollTop)
      : 0;
    if (lenis) lenis.scrollTo(sectionTop, { immediate: true });
    else window.scrollTo({ top: sectionTop, behavior: "instant" });
  };

  if (!carAtGarage) return null;

  return (
    <div className="about-end-overlay" aria-hidden="false">
      <div className="about-end-buttons">
        <a href={CV_URL} download className="about-end-btn about-end-btn-primary">
          <Download size={18} />
          Download CV
        </a>
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="about-end-btn"
        >
          <Linkedin size={18} />
          LinkedIn
        </a>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="about-end-btn"
        >
          <Github size={18} />
          GitHub
        </a>
        <button type="button" onClick={onReplay} className="about-end-btn about-end-btn-replay">
          <RotateCcw size={18} />
          Replay
        </button>
      </div>
    </div>
  );
}

interface AboutJourneyProps {
  milestones: Milestone[];
}

const LOOP_RUNWAY = 800;

export function AboutJourney({ milestones }: AboutJourneyProps) {
  const sectionTopRef = useRef<HTMLDivElement>(null);
  const [loaderHidden, setLoaderHidden] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const [viewportHeight, setViewportHeight] = useState(800);

  const totalHeight = (milestones.length + 1) * PIXELS_PER_MOVE;
  const scrollContentHeight = totalHeight + Math.max(viewportHeight, LOOP_RUNWAY);
  const trackPositions = getTrackPositions(milestones.length);

  useEffect(() => {
    const updateHeight = () => setViewportHeight(window.innerHeight);
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoaderHidden(true);
    }, 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <ScrollDriveProvider milestoneCount={milestones.length}>
      <div className="about-drive-root">
        <div
          id="loader"
          className="about-loader"
          style={{ opacity: loaderHidden ? 0 : 1, display: loaderHidden ? "none" : "flex" }}
        >
          CALIBRATING DRONE...
        </div>

        <div id="canvas-container" className="about-canvas-container">
          <Canvas
            camera={{ position: [0, 50, 50], fov: 45 }}
            gl={{ antialias: true, alpha: false }}
            onCreated={({ gl }) => {
              gl.setClearColor(0xf8f8f8, 1); /* match scene so canvas is never black */
            }}
            dpr={[1, 2]}
            className="about-canvas"
          >
            <TrackScene trackPositions={trackPositions} />
          </Canvas>
        </div>

        <div className="about-title-bar">
          <span className="about-title-bar-badge">About</span>
          <span className="about-title-bar-label">My Journey</span>
          <span className="about-title-bar-teaser">Scroll to drive, click markers for story</span>
        </div>

        <ScrollInstruction />

        <div id="overlay" className="about-overlay">
          <OverlayMarkers
            milestones={milestones}
            trackPositions={trackPositions}
            expandedIndex={expandedIndex}
            onToggleExpand={(i) => setExpandedIndex((prev) => (prev === i ? -1 : i))}
            onMinimize={(e, i) => {
              e.stopPropagation();
              setExpandedIndex(-1);
            }}
          />
          <MilestoneScoreboardWrapper
            milestones={milestones}
            pixelsPerMove={PIXELS_PER_MOVE}
            sectionTopRef={sectionTopRef}
          />
          <EndOverlay sectionTopRef={sectionTopRef} />
        </div>

        <div
          ref={sectionTopRef}
          id="scroll-proxy"
          className="about-scroll-proxy"
          style={{ height: `${scrollContentHeight}px` }}
        />

        <ScrollLogic
          milestones={milestones}
          totalHeight={totalHeight}
          scrollContentHeight={scrollContentHeight}
          sectionTopRef={sectionTopRef}
        />
      </div>
    </ScrollDriveProvider>
  );
}