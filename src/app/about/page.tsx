import { getMilestones } from "@/lib/milestonesData";
import { ClientAboutTimeline } from "@/components/about/ClientAboutTimeline";
import Footer from "@/components/Footer";

import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';

export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await supabase
    .from('layout_settings')
    .select('about_meta_title, about_meta_description')
    .single();

  return {
    title: settings?.about_meta_title || "About — My Journey",
    description: settings?.about_meta_description || "About me and my career journey. Scroll to drive through the timeline.",
  };
}

export default async function AboutPage() {
  const milestones = await getMilestones();
  return (
    <>
      <ClientAboutTimeline milestones={milestones} />
      <Footer />
    </>
  );
}
