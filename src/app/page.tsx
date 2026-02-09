import MonitorHero from "@/components/hero/MonitorHero";
import Introduction from "@/components/sections/Introduction";

export default function Home() {
  return (
    // We force the main container to be full height min but allow scrolling
    <main className="w-full bg-[#f4f4f5]">
      <MonitorHero />
      <Introduction />
    </main>
  );
}
