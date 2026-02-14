"use client";

import { useEffect } from "react";
import { setMilestoneCount } from "./trackCurve";
import { AboutJourney } from "./AboutJourney";
import type { Milestone } from "@/lib/milestonesData";

interface AboutJourneyWrapperProps {
  milestones: Milestone[];
}

/**
 * Wrapper component that initializes the track size based on milestone count
 * before rendering the main journey component.
 */
export function AboutJourneyWrapper({ milestones }: AboutJourneyWrapperProps) {
  useEffect(() => {
    // Initialize track size based on number of milestones
    setMilestoneCount(milestones.length);
  }, [milestones.length]);

  return <AboutJourney milestones={milestones} />;
}
