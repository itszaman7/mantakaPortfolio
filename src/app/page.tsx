import EditorialHero from "@/components/hero/EditorialHero";
import HeroStatsReel from "@/components/hero/HeroStatsReel";
import ProjectGallery from "@/components/work/ProjectGallery";
import Footer from "@/components/Footer";

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
