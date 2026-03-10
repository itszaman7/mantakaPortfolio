import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import BlogClient from './BlogClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
    const { data: settings } = await supabase
        .from('layout_settings')
        .select('blog_meta_title, blog_meta_description')
        .single();

    return {
        title: settings?.blog_meta_title || "Blog — Tech, Design & Pixels",
        description: settings?.blog_meta_description || "Exploring the intersection of code and creative design.",
    };
}

export default async function BlogPage() {
    const { data: blogs } = await supabase
        .from('blogs')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

    return <BlogClient blogs={blogs || []} />;
}
