import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://mantaka.com'; // Replace with actual production URL if different

    // Static routes
    const staticRoutes = ['', '/about', '/work', '/blog', '/contact'].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic projects
    const { data: projects } = await supabase
        .from('projects')
        .select('slug, created_at');

    const projectRoutes = (projects || []).map((project) => ({
        url: `${baseUrl}/work/${project.slug}`,
        lastModified: new Date(project.created_at || Date.now()),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    // Dynamic blogs
    const { data: blogs } = await supabase
        .from('blogs')
        .select('slug, created_at')
        .eq('published', true);

    const blogRoutes = (blogs || []).map((blog) => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: new Date(blog.created_at || Date.now()),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}
