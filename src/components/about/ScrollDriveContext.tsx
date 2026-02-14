"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

export interface MarkerScreenPosition {
  x: number;
  y: number;
  visible: boolean;
}

interface ScrollDriveContextValue {
  carProgress: number;
  setCarProgress: (p: number) => void;
  markerScreenPositions: MarkerScreenPosition[];
  setMarkerScreenPositions: (positions: MarkerScreenPosition[]) => void;
  activeMarkerIndex: number;
  setActiveMarkerIndex: (i: number) => void;
  visitedMilestoneIndices: Set<number>;
  addVisitedMilestone: (index: number) => void;
  journeyFinished: boolean;
  setJourneyFinished: (v: boolean) => void;
  carAtGarage: boolean;
  setCarAtGarage: (v: boolean) => void;
  replayTrigger: number;
  triggerReplay: () => void;
}

/** Start the car on the straight near the START line. Export so scroll logic uses it when scroll is at top. Lower = closer to the very start. */
export const INITIAL_CAR_PROGRESS = 0.08;

const ScrollDriveContext = createContext<ScrollDriveContextValue | null>(null);

export function useScrollDrive() {
  const ctx = useContext(ScrollDriveContext);
  if (!ctx) throw new Error("useScrollDrive must be used inside ScrollDriveProvider");
  return ctx;
}

export function ScrollDriveProvider({
  children,
  milestoneCount,
}: {
  children: React.ReactNode;
  milestoneCount: number;
}) {
  const [carProgress, setCarProgress] = useState(INITIAL_CAR_PROGRESS);
  const [markerScreenPositions, setMarkerScreenPositions] = useState<MarkerScreenPosition[]>(
    () => Array.from({ length: milestoneCount }, () => ({ x: 0, y: 0, visible: false }))
  );
  const [activeMarkerIndex, setActiveMarkerIndex] = useState(-1);
  const [visitedMilestoneIndices, setVisitedMilestoneIndices] = useState<Set<number>>(() => new Set());
  const [journeyFinished, setJourneyFinished] = useState(false);
  const [carAtGarage, setCarAtGarage] = useState(false);
  const [replayTrigger, setReplayTrigger] = useState(0);

  const triggerReplay = useCallback(() => {
    setReplayTrigger((k) => k + 1);
    setVisitedMilestoneIndices(new Set());
  }, []);

  const addVisited = useCallback((index: number) => {
    if (index < 0) return;
    setVisitedMilestoneIndices((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      carProgress,
      setCarProgress,
      markerScreenPositions,
      setMarkerScreenPositions,
      activeMarkerIndex,
      setActiveMarkerIndex,
      visitedMilestoneIndices,
      addVisitedMilestone: addVisited,
      journeyFinished,
      setJourneyFinished,
      carAtGarage,
      setCarAtGarage,
      replayTrigger,
      triggerReplay,
    }),
    [
      carProgress,
      markerScreenPositions,
      activeMarkerIndex,
      visitedMilestoneIndices,
      addVisited,
      journeyFinished,
      carAtGarage,
      replayTrigger,
    ]
  );

  return (
    <ScrollDriveContext.Provider value={value}>
      {children}
    </ScrollDriveContext.Provider>
  );
}
