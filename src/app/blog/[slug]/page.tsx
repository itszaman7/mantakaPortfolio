import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import BlogContent from './BlogContent';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const { data: blog } = await supabase
        .from('blogs')
        .select('title, excerpt, meta_title, meta_description')
        .eq('slug', slug)
        .eq('published', true)
        .single();

    if (!blog) return { title: 'Blog Not Found' };

    return {
        title: blog.meta_title || `${blog.title} | Mantaka Blog`,
        description: blog.meta_description || blog.excerpt || "A deep dive into tech and design.",
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { data: blog, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

    if (error || !blog) {
        notFound();
    }

    const { data: relatedData } = await supabase
        .from('blogs')
        .select('id, title, slug, cover_image, created_at')
        .eq('published', true)
        .neq('id', blog.id)
        .order('created_at', { ascending: false })
        .limit(3);

    return <BlogContent blog={blog} related={relatedData || []} />;
}
