import { supabase } from '@/lib/supabase';
import { slugify } from '@/utils/slugify';

export type MediaItem = { type: "image"; url: string } | { type: "video"; url: string };

export interface Project {
    id: string;
    slug: string;
    title: string;
    category: string;
    src: string;
    description: string;
    // Story Mode Fields
    story_challenge?: string;
    story_solution?: string;
    story_outcome?: string;
    // Links
    code_link?: string;
    demo_link?: string;
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

/**
 * Fetches projects from Supabase and transforms them to match the Project interface.
 */
export async function getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching projects:', error);
        return [];
    }

    return (data || []).map((p: any) => ({
        id: p.id,
        slug: p.slug || slugify(p.title),
        title: p.title,
        category: p.category,
        subtitle: p.subtitle,
        src: p.src,
        description: p.description,
        story_challenge: p.story_challenge,
        story_solution: p.story_solution,
        story_outcome: p.story_outcome,
        code_link: p.code_link,
        demo_link: p.demo_link,
        techStack: p.tech_stack || [],
        award: p.award_name ? {
            name: p.award_name,
            link: p.award_link || '#'
        } : undefined,
        media: p.media || [],
        link: p.link || '#',
        backgroundColor: p.background_color,
    }));
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
    const projects = await getProjects();
    return projects.find((p) => p.slug === slug);
}

export async function getNextProject(currentSlug: string): Promise<Project | undefined> {
    const projects = await getProjects();
    const currentIndex = projects.findIndex((p) => p.slug === currentSlug);
    if (currentIndex === -1) return undefined;
    return projects[(currentIndex + 1) % projects.length];
}

/** Returns other projects (excluding current by slug), for "Other projects" section. */
export async function getOtherProjects(currentSlug: string, limit = 4): Promise<Project[]> {
    const projects = await getProjects();
    return projects.filter((p) => p.slug !== currentSlug).slice(0, limit);
}

// Keep the existing helper
export function getProjectBackgroundColor(project: Project, index: number): string {
    return project.backgroundColor ?? CARD_BG_PALETTE[index % CARD_BG_PALETTE.length];
}
