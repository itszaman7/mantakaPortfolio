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
    /** Optional: full-section card background (e.g. #F0FFF0). If omitted and project has an image (src/media), the card uses a color derived from that image; otherwise uses palette by index. */
    backgroundColor?: string;
    /** Optional: subtitle line under the section number (e.g. "Global Events, Brand Activations"). */
    subtitle?: string;
}

const CARD_BG_PALETTE = ["#1DB954", "#851121", "#5038A0", "#FFFFE0"] as const;

export const projects: Project[] = [
    {
        id: "1",
        title: "OptiHealth",
        category: "HEALTH-TECH",
        subtitle: "Agentic AI, Multimodal Diagnostics, Telemedicine",
        src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop",
        description: "An award-winning 'Virtual Doctor' ecosystem featuring an autonomous health analyzer and multimodal symptom checker using Gemini Vision.",
        techStack: ["Django", "Next.js", "LangGraph", "Gemini Vision", "Llama 3"],
        award: { 
            name: "Winner - IUB CARD 2025", 
            link: "#" 
        },
        link: "#",
        backgroundColor: "#1DB954",
    },
    {
        id: "2",
        title: "Krishi Sahay",
        category: "AGRI-TECH",
        subtitle: "IoT, Microservices, Computer Vision",
        src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format&fit=crop",
        description: "AI agricultural platform streaming real-time data from 1,500+ IoT sensors with 95.3% accuracy in crop disease detection.",
        techStack: ["FastAPI", "Next.js", "YOLOv11", "Gemini Pro", "ESP32"],
        award: { 
            name: "Finalist - DU VisionX 2025", 
            link: "#" 
        },
        link: "#",
        backgroundColor: "#851121",
    },
    {
        id: "3",
        title: "Oasis Planner",
        category: "CLIMATE",
        subtitle: "GIS, Satellite Data, Urban Resilience",
        src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2070&auto=format&fit=crop",
        description: "A NASA-recognized urban planning dashboard that models flood risks by integrating satellite climate data.",
        techStack: ["Next.js", "Python", "GIS", "Leaflet", "NASA Earthdata"],
        award: { 
            name: "NASA Space Apps Global Nominee", 
            link: "#" 
        },
        link: "#",
        backgroundColor: "#5038A0",
    },
    {
        id: "4",
        title: "PQDeals",
        category: "E-COMMERCE",
        subtitle: "B2B Logistics, RFQ Systems, DevOps",
        src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop",
        description: "A full-scale B2B platform with custom RFQ logic, secured via Docker and Nginx on AWS infrastructure.",
        techStack: ["Django", "Docker", "Nginx", "PostgreSQL", "AWS EC2"],
        link: "#",
        backgroundColor: "#FFFFE0",
    },
];



export function getProjectBackgroundColor(project: Project, index: number): string {
    return project.backgroundColor ?? CARD_BG_PALETTE[index % CARD_BG_PALETTE.length];
}
