import { getMilestones } from "@/lib/milestonesData";
import { AboutJourney } from "@/components/about/AboutJourney";

export const metadata = {
  title: "About — My Journey",
  description: "About me and my career journey. Scroll to drive through the timeline.",
};

export default async function AboutPage() {
  const milestones = await getMilestones();
  return <AboutJourney milestones={milestones} />;
}
