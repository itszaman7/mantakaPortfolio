import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import ContactClient from './ContactClient';

const DEFAULTS = {
  email: 'mantaka35@gmail.com',
  location: 'Dhaka, Bangladesh',
  location_note: 'Available Remotely',
  availability_label: 'Available for Commissions',
  response_time: 'Average response: 24h',
  social_links: [
    { name: 'LinkedIn', url: 'https://linkedin.com/in/mantaka' },
    { name: 'GitHub', url: 'https://github.com/itszaman7' },
    { name: 'WhatsApp', url: 'https://wa.me/8801778961590' },
    { name: 'Instagram', url: '#' },
  ],
  skills: ['Clean Code', 'Modern Stack', 'Pixel Perfect', 'End-to-End Delivery', 'React & Next.js', 'UI/UX Design'],
};

export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await supabase
    .from('layout_settings')
    .select('contact_meta_title, contact_meta_description')
    .single();

  return {
    title: settings?.contact_meta_title || "Contact — Let's Work Together",
    description: settings?.contact_meta_description || "Get in touch for new projects, collaborations, or just to say hi.",
  };
}

export default async function ContactPage() {
  const { data: contactData } = await supabase
    .from('contact_settings')
    .select('*')
    .limit(1)
    .single();

  const settings = {
    email: contactData?.email || DEFAULTS.email,
    location: contactData?.location || DEFAULTS.location,
    location_note: contactData?.location_note || DEFAULTS.location_note,
    availability_label: contactData?.availability_label || DEFAULTS.availability_label,
    response_time: contactData?.response_time || DEFAULTS.response_time,
    social_links: Array.isArray(contactData?.social_links) ? contactData.social_links : DEFAULTS.social_links,
    skills: Array.isArray(contactData?.skills) ? contactData.skills : DEFAULTS.skills,
  };

  return <ContactClient settings={settings} />;
}
