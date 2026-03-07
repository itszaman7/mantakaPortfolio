import EditorialHero from "@/components/hero/EditorialHero";
import HeroStatsReel from "@/components/hero/HeroStatsReel";
import ProjectGallery from "@/components/work/ProjectGallery";
import Footer from "@/components/Footer";
import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';

export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await supabase
    .from('layout_settings')
    .select('home_meta_title, home_meta_description')
    .single();

  return {
    title: settings?.home_meta_title || "Mantaka | Creative Developer Portfolio",
    description: settings?.home_meta_description || "Showcasing high-end digital experiences and modern design.",
  };
}

export default function Home() {
  return (
    <main className="w-full">
      <EditorialHero />
      <ProjectGallery />
      <HeroStatsReel />
      <Footer />
    </main>
  );
}
