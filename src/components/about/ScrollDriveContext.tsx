"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

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
  journeyFinished: boolean;
  setJourneyFinished: (v: boolean) => void;
  carAtGarage: boolean;
  setCarAtGarage: (v: boolean) => void;
  replayTrigger: number;
  triggerReplay: () => void;
}

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
  const [carProgress, setCarProgress] = useState(0);
  const [markerScreenPositions, setMarkerScreenPositions] = useState<MarkerScreenPosition[]>(
    () => Array.from({ length: milestoneCount }, () => ({ x: 0, y: 0, visible: false }))
  );
  const [activeMarkerIndex, setActiveMarkerIndex] = useState(-1);
  const [journeyFinished, setJourneyFinished] = useState(false);
  const [carAtGarage, setCarAtGarage] = useState(false);
  const [replayTrigger, setReplayTrigger] = useState(0);
  const triggerReplay = useCallback(() => setReplayTrigger((k) => k + 1), []);

  return (
    <ScrollDriveContext.Provider
      value={{
        carProgress,
        setCarProgress,
        markerScreenPositions,
        setMarkerScreenPositions,
        activeMarkerIndex,
        setActiveMarkerIndex,
        journeyFinished,
        setJourneyFinished,
        carAtGarage,
        setCarAtGarage,
        replayTrigger,
        triggerReplay,
      }}
    >
      {children}
    </ScrollDriveContext.Provider>
  );
}
