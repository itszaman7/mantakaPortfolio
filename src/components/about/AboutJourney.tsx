"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useLenis } from "lenis/react";
import { ChevronDown, Download, Linkedin, Github, RotateCcw } from "lucide-react";
import { ScrollDriveProvider, useScrollDrive } from "./ScrollDriveContext";
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
const PIXELS_PER_STOP = 800;

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
}: {
  milestones: Milestone[];
  totalHeight: number;
  scrollContentHeight: number;
}) {
  const {
    setCarProgress,
    setActiveMarkerIndex,
    setJourneyFinished,
    setCarAtGarage,
    journeyFinished,
    replayTrigger,
  } = useScrollDrive();
  const n = milestones.length;
  const endTriggeredRef = React.useRef(false);

  useEffect(() => {
    endTriggeredRef.current = false;
  }, [replayTrigger]);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY ?? document.documentElement.scrollTop;
      if (totalHeight <= 0) return;
      if (journeyFinished) return;

      const effectiveScroll = Math.min(scrollY, totalHeight);

      if (scrollY >= totalHeight - 5 && !endTriggeredRef.current) {
        endTriggeredRef.current = true;
        setCarProgress(1);
        setActiveMarkerIndex(-1);
        setJourneyFinished(true);
        setTimeout(() => setCarAtGarage(true), 800);
        return;
      }

      let currentTrackP = 0;
      let currentScrollPointer = 0;
      let activeStopIndex = -1;

      for (let i = 0; i < n; i++) {
        const moveEnd = currentScrollPointer + PIXELS_PER_MOVE;
        const stopEnd = moveEnd + PIXELS_PER_STOP;
        const prevTrackPos = i === 0 ? 0 : i / (n + 1);
        const nextTrackPos = (i + 1) / (n + 1);

        if (effectiveScroll < moveEnd) {
          const localProgress = (effectiveScroll - currentScrollPointer) / PIXELS_PER_MOVE;
          currentTrackP = prevTrackPos + localProgress * (nextTrackPos - prevTrackPos);
          break;
        } else if (effectiveScroll < stopEnd) {
          currentTrackP = nextTrackPos;
          activeStopIndex = i;
          break;
        }
        currentScrollPointer = stopEnd;
        if (i === n - 1 && effectiveScroll >= stopEnd) {
          const localProgress = Math.min(
            1,
            (effectiveScroll - stopEnd) / PIXELS_PER_MOVE
          );
          currentTrackP = nextTrackPos + localProgress * (1 - nextTrackPos);
        }
      }

      setCarProgress(Math.min(1, currentTrackP));
      setActiveMarkerIndex(activeStopIndex);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [n, totalHeight, scrollContentHeight, journeyFinished, replayTrigger, setCarProgress, setActiveMarkerIndex, setJourneyFinished, setCarAtGarage]);

  return null;
}

function OverlayMarkers({
  milestones,
  expandedIndex,
  onToggleExpand,
  onMinimize,
}: {
  milestones: Milestone[];
  expandedIndex: number;
  onToggleExpand: (index: number) => void;
  onMinimize: (e: React.MouseEvent, index: number) => void;
}) {
  const { markerScreenPositions, activeMarkerIndex } = useScrollDrive();

  return (
    <>
      {milestones.map((milestone, index) => {
        const pos = markerScreenPositions[index] ?? { x: 0, y: 0, visible: false };
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
            className={`scroll-marker ${activeMarkerIndex === index ? "active" : ""} ${isExpanded ? "expanded" : ""}`}
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
              {thumb && <img src={thumb} alt="" className="marker-thumb" />}
              <div className="marker-info">
                <div className="marker-title">{milestone.title}</div>
                <div className="marker-teaser">{teaser}</div>
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

function scrollOffsetForMilestone(
  index: number,
  pixelsPerMove: number,
  pixelsPerStop: number
): number {
  return index * (pixelsPerMove + pixelsPerStop) + pixelsPerMove + 80;
}

function MilestoneScoreboardWrapper({
  milestones,
  pixelsPerMove,
  pixelsPerStop,
}: {
  milestones: Milestone[];
  pixelsPerMove: number;
  pixelsPerStop: number;
}) {
  const lenis = useLenis();
  const { setJourneyFinished, setCarAtGarage, activeMarkerIndex } = useScrollDrive();

  const onSelectMilestone = (index: number) => {
    setJourneyFinished(false);
    setCarAtGarage(false);
    const targetY = scrollOffsetForMilestone(index, pixelsPerMove, pixelsPerStop);
    if (lenis) lenis.scrollTo(targetY, { lerp: 0.12 });
    else window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  return (
    <MilestoneScoreboard
      milestones={milestones}
      activeMarkerIndex={activeMarkerIndex}
      onSelectMilestone={onSelectMilestone}
    />
  );
}

const LINKEDIN_URL = "https://linkedin.com/in/mantaka";
const GITHUB_URL = "https://github.com/itszaman7";
const CV_URL = "/cv.pdf";

function EndOverlay() {
  const { carAtGarage, setJourneyFinished, setCarAtGarage, triggerReplay } = useScrollDrive();
  const lenis = useLenis();

  const onReplay = () => {
    setJourneyFinished(false);
    setCarAtGarage(false);
    triggerReplay();
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo({ top: 0, behavior: "instant" });
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
  const [loaderHidden, setLoaderHidden] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const [viewportHeight, setViewportHeight] = useState(800);

  const totalHeight =
    (milestones.length + 1) * PIXELS_PER_MOVE + milestones.length * PIXELS_PER_STOP;
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
            pixelsPerStop={PIXELS_PER_STOP}
          />
          <EndOverlay />
        </div>

        <div
          id="scroll-proxy"
          className="about-scroll-proxy"
          style={{ height: `${scrollContentHeight}px` }}
        />

        <ScrollLogic
          milestones={milestones}
          totalHeight={totalHeight}
          scrollContentHeight={scrollContentHeight}
        />
      </div>
    </ScrollDriveProvider>
  );
}