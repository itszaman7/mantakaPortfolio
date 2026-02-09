import HeroScroll from "@/components/hero/HeroScroll";
import MonitorHero from "@/components/hero/MonitorHero";
import ProjectGallery from "@/components/work/ProjectGallery";

export default function Home() {
  return (
    // We force the main container to be full height min but allow scrolling
    <main className="w-full bg-[#f4f4f5]">
      <MonitorHero />
      <HeroScroll />
      <ProjectGallery />
    </main>
  );
}
