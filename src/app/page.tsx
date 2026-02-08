"use client";

import MonitorHero from "@/components/hero/MonitorHero";

export default function Home() {
  return (
    // We force the main container to be full height and hide overflow
    // to preserve the "Midlife" fixed aesthetic.
    <main className="w-full h-screen overflow-hidden bg-[#f4f4f5]">
      <MonitorHero />
    </main>
  );
}