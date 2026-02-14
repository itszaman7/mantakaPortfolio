import { supabase } from "@/lib/supabase";

/**
 * Supabase table "milestones" should have: id (uuid), year (text), title (text),
 * description (text), images (jsonb array of strings), tags (jsonb array), side (text: left|right|center), sort_order (int).
 */

export interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
  images: string[];
  tags: string[];
  side: "left" | "right" | "center";
  sort_order?: number;
}

const FALLBACK_MILESTONES: Milestone[] = [
  {
    id: "1",
    year: "2021",
    title: "The Rookie Season",
    description:
      "Started my journey in web development. Mastered HTML, CSS, and JavaScript basics.",
    images: [
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&q=80&w=800",
    ],
    tags: ["HTML", "CSS", "JS"],
    side: "left",
    sort_order: 0,
  },
  {
    id: "2",
    year: "2022",
    title: "Full Stack Debut",
    description:
      "Launched my first full-stack application. Learned React and Node.js. Secured my first freelance client.",
    images: [
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
    ],
    tags: ["React", "Node.js"],
    side: "right",
    sort_order: 1,
  },
  {
    id: "3",
    year: "2023",
    title: "Performance Era",
    description:
      "Optimized legacy codebases for 300% performance gain. Won 'Best UI' at the Regional Hackathon.",
    images: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    ],
    tags: ["Performance", "UI/UX"],
    side: "left",
    sort_order: 2,
  },
  {
    id: "4",
    year: "2024",
    title: "Team Lead",
    description:
      "Led a team of 5 developers. Delivered a mission-critical SaaS platform. Deep dive into 3D WebGL.",
    images: [
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
    ],
    tags: ["Leadership", "WebGL"],
    side: "right",
    sort_order: 3,
  },
  {
    id: "5",
    year: "2025",
    title: "New Horizons",
    description:
      "Currently open for new opportunities. Specializing in immersive web experiences.",
    images: [
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800",
    ],
    tags: ["Open for Work"],
    side: "center",
    sort_order: 4,
  },
];

/**
 * Fetches milestones from Supabase. Falls back to static data if the table
 * doesn't exist or the request fails.
 */
export async function getMilestones(): Promise<Milestone[]> {
  try {
    const { data, error } = await supabase
      .from("milestones")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.warn("Milestones fetch failed, using fallback:", error.message);
      return FALLBACK_MILESTONES;
    }

    if (!data || data.length === 0) return FALLBACK_MILESTONES;

    return data.map((row: Record<string, unknown>) => ({
      id: String(row.id ?? ""),
      year: String(row.year ?? ""),
      title: String(row.title ?? ""),
      description: String(row.description ?? row.story ?? ""),
      images: Array.isArray(row.images) ? (row.images as string[]) : [],
      tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
      side:
        row.side === "right" || row.side === "center"
          ? row.side
          : ("left" as const),
      sort_order: typeof row.sort_order === "number" ? row.sort_order : 0,
    }));
  } catch {
    return FALLBACK_MILESTONES;
  }
}
