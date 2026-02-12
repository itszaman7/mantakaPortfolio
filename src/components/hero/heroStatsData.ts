import { supabase } from "@/lib/supabase";

export interface StatsSlide {
    id: string;
    title: string;
    subtitle: string;
    highlight: string;
    suffix: string;
    description: string;
    image: string;
}

/** Fallback when DB is empty or fetch fails */
export const statsSlidesFallback: StatsSlide[] = [
    {
        id: "2",
        title: "Hackathon",
        subtitle: "Victories",
        highlight: "6",
        suffix: "+",
        description:
            "Winner of IUB CARD 2025 and Global Nominee in the NASA Space Apps Challenge[cite: 8, 77, 78, 81].",
        image:
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
    },
    {
        id: "3",
        title: "Freelance",
        subtitle: "Experience",
        highlight: "3",
        suffix: "yrs",
        description:
            "Delivering full-stack solutions and MVPs for international startups and local businesses since 2023[cite: 12, 73, 85].",
        image:
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop",
    },
    {
        id: "1",
        title: "Research",
        subtitle: "Publications",
        highlight: "2",
        suffix: "",
        description:
            "Published works in Dark Web threat intelligence and thoracic disease detection at ICCIT and IEEE[cite: 48, 49, 53].",
        image:
            "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2073&auto=format&fit=crop",
    },
    {
        id: "4",
        title: "Clients",
        subtitle: "Worked with",
        highlight: "3",
        suffix: "+",
        description:
            "Trusted by organizations like Model Act (Finland), IUB, and local institutions like Khalid Bin Walid Madrasa[cite: 10, 16, 86].",
        image:
            "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
    },
];

/** Fetches hero stats from Supabase. Table: hero_stats (id, title, subtitle, highlight, suffix, description, image, sort_order). Falls back to statsSlidesFallback if empty or error. */
export async function getHeroStats(): Promise<StatsSlide[]> {
    const { data, error } = await supabase
        .from("hero_stats")
        .select("id, title, subtitle, highlight, suffix, description, image, sort_order")
        .order("sort_order", { ascending: true });

    if (error) {
        console.error("Error fetching hero stats:", error);
        return statsSlidesFallback;
    }

    if (!data?.length) return statsSlidesFallback;

    return data.map((row: { id: string; title: string; subtitle: string; highlight: string; suffix: string | null; description: string; image: string; sort_order?: number }) => ({
        id: String(row.id),
        title: row.title ?? "",
        subtitle: row.subtitle ?? "",
        highlight: row.highlight ?? "",
        suffix: row.suffix ?? "",
        description: row.description ?? "",
        image: row.image ?? "",
    }));
}