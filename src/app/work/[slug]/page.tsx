import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getProjectBySlug, getOtherProjects } from '@/components/work/projectsData';
import ProjectClient from './ProjectClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) return { title: 'Project Not Found' };

  return {
    title: project.meta_title || `${project.title} | Mantaka Project`,
    description: project.meta_description || project.introduction || "Project details and showcase.",
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, otherProjects] = await Promise.all([
    getProjectBySlug(slug),
    getOtherProjects(slug, 4),
  ]);

  if (!project) {
    notFound();
  }

  return <ProjectClient project={project} otherProjects={otherProjects} />;
}
