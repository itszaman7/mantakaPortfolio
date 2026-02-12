import HeroScroll from "@/components/hero/HeroScroll";
import HeroStatsReel from "@/components/hero/HeroStatsReel";
import MonitorHero from "@/components/hero/MonitorHero";
import ProjectGallery from "@/components/work/ProjectGallery";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="w-full bg-[#f4f4f5]">
      <MonitorHero />
      <HeroScroll />
      <ProjectGallery />
      <HeroStatsReel />
      <Footer />
    </main>
  );
}
