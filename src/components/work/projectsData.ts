export type MediaItem = { type: "image"; url: string } | { type: "video"; url: string };

export interface Project {
    id: string;
    title: string;
    category: string;
    src: string;
    description: string;
    techStack: string[];
    award?: {
        name: string;
        link: string;
    };
    /** Optional: multiple images/videos to cycle with arrows. Falls back to single `src` if not set. */
    media?: MediaItem[];
    /** Optional: URL for "See work" button */
    link?: string;
    /** Optional: full-section card background (e.g. #F0FFF0). Fallback from palette by index. */
    backgroundColor?: string;
    /** Optional: subtitle line under the section number (e.g. "Global Events, Brand Activations"). */
    subtitle?: string;
}

const CARD_BG_PALETTE = ["#F0FFF0", "#E0F4FF", "#FFF8E0", "#F0E8FF"] as const;

export const projects: Project[] = [
    {
        id: "1",
        title: "Project Alpha",
        category: "FINTECH",
        subtitle: "Dashboards, Data Viz, Real-time Analytics",
        src: "/pattern.png",
        description: "A next-gen financial dashboard that visualizes complex data streams in real-time.",
        techStack: ["React", "Next.js", "TS"],
        award: { name: "Site of the Day", link: "https://www.awwwards.com" },
        link: "#",
        backgroundColor: "#F0FFF0",
    },
    {
        id: "2",
        title: "Neon Horizon",
        category: "ART",
        subtitle: "WebGL, Interactive Experiences, 3D",
        src: "/pattern.png",
        description: "Interactive WebGL experience exploring futuristic cityscapes.",
        techStack: ["Three.js", "GLSL"],
        link: "#",
        backgroundColor: "#E0F4FF",
    },
    {
        id: "3",
        title: "EcoTrack",
        category: "SUSTAINABILITY",
        subtitle: "Carbon Tracking, Enterprise, AI",
        src: "/pattern.png",
        description: "AI-driven carbon footprint tracking for enterprise logistics.",
        techStack: ["Python", "TensorFlow"],
        link: "#",
        backgroundColor: "#FFF8E0",
    },
    {
        id: "4",
        title: "Quantum UI",
        category: "DESIGN SYSTEM",
        subtitle: "Design Systems, Components, Figma",
        src: "/pattern.png",
        description: "A comprehensive design system for quantum computing interfaces.",
        techStack: ["Figma", "React"],
        award: { name: "Best UI", link: "https://www.behance.net" },
        link: "#",
        backgroundColor: "#F0E8FF",
    },
];

export function getProjectBackgroundColor(project: Project, index: number): string {
    return project.backgroundColor ?? CARD_BG_PALETTE[index % CARD_BG_PALETTE.length];
}
