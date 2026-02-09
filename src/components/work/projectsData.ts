
export interface Project {
    id: string;
    title: string;
    category: string;
    src: string;
    description: string;
    techStack: string[];
    award?: {
        name: string;
        icon: string;
    };
}

export const projects: Project[] = [
    {
        id: "1",
        title: "Project Alpha",
        category: "FINTECH",
        src: "/pattern.png", // Using existing asset as placeholder
        description: "A next-gen financial dashboard that visualizes complex data streams in real-time.",
        techStack: ["React", "Next.js", "TS"],
        award: { name: "Site of the Day", icon: "🏆" },
    },
    {
        id: "2",
        title: "Neon Horizon",
        category: "ART",
        src: "/pattern.png",
        description: "Interactive WebGL experience exploring futuristic cityscapes.",
        techStack: ["Three.js", "GLSL"],
    },
    {
        id: "3",
        title: "EcoTrack",
        category: "SUSTAINABILITY",
        src: "/pattern.png",
        description: "AI-driven carbon footprint tracking for enterprise logistics.",
        techStack: ["Python", "TensorFlow"],
    },
    {
        id: "4",
        title: "Quantum UI",
        category: "DESIGN SYSTEM",
        src: "/pattern.png",
        description: "A comprehensive design system for quantum computing interfaces.",
        techStack: ["Figma", "React"],
        award: { name: "Best UI", icon: "✨" },
    },
];
