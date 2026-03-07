import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { getProjects } from '@/components/work/projectsData';
import WorkClient from './WorkClient';

export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await supabase
    .from('layout_settings')
    .select('work_meta_title, work_meta_description')
    .single();

  return {
    title: settings?.work_meta_title || "Work — Selected Projects",
    description: settings?.work_meta_description || "A showcase of my recent design and development work.",
  };
}

export default async function WorkPage() {
  const projects = await getProjects();

  return <WorkClient projects={projects} />;
}