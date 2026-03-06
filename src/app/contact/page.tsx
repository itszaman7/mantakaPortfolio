'use client';

import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { supabase } from '@/lib/supabase';
import { submitContactForm } from './actions';
import Footer from '@/components/Footer';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ContactSettings {
  email: string;
  location: string;
  location_note: string;
  availability_label: string;
  response_time: string;
  social_links: { name: string; url: string }[];
  skills: string[];
}

const DEFAULTS: ContactSettings = {
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

const inquiryTypes = [
  { value: 'web', label: 'Web Development' },
  { value: 'branding', label: 'Brand Identity' },
  { value: 'uiux', label: 'UI/UX Design' },
  { value: 'fullstack', label: 'Full-Stack App' },
  { value: 'other', label: 'Other' },
];

export default function ContactPage() {
  const [settings, setSettings] = useState<ContactSettings>(DEFAULTS);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeInquiry, setActiveInquiry] = useState('');

  const mainRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const bigTextRef = useRef<HTMLDivElement>(null);

  // Fetch contact settings from Supabase
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('contact_settings')
          .select('*')
          .limit(1)
          .single();
        if (!error && data) {
          setSettings({
            email: data.email || DEFAULTS.email,
            location: data.location || DEFAULTS.location,
            location_note: data.location_note || DEFAULTS.location_note,
            availability_label: data.availability_label || DEFAULTS.availability_label,
            response_time: data.response_time || DEFAULTS.response_time,
            social_links: Array.isArray(data.social_links) ? data.social_links : DEFAULTS.social_links,
            skills: Array.isArray(data.skills) ? data.skills : DEFAULTS.skills,
          });
        }
      } catch {
        // Use defaults silently
      }
    };
    fetchSettings();
  }, []);

  useLayoutEffect(() => {
    if (!mainRef.current) return;

    const ctx = gsap.context(() => {
      // Title reveal
      if (titleRef.current) {
        const overflows = titleRef.current.querySelectorAll('.overflow-hidden');
        overflows.forEach((el, i) => {
          const child = el.children[0] as HTMLElement;
          if (child) {
            gsap.fromTo(
              child,
              { y: '110%' },
              { y: '0%', duration: 1, ease: 'power4.out', delay: 0.15 + i * 0.12 }
            );
          }
        });
      }

      // Left column stagger
      if (infoRef.current) {
        const sections = infoRef.current.querySelectorAll('.reveal-section');
        gsap.fromTo(
          sections,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out',
            scrollTrigger: { trigger: infoRef.current, start: 'top 80%' },
          }
        );
      }

      // Form slide in
      if (formRef.current) {
        gsap.fromTo(
          formRef.current,
          { x: 60, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2,
            scrollTrigger: { trigger: formRef.current, start: 'top 75%' },
          }
        );
      }

      // Big background text parallax
      if (bigTextRef.current && mainRef.current) {
        gsap.to(bigTextRef.current, {
          scrollTrigger: { trigger: mainRef.current, start: 'top top', end: 'bottom top', scrub: 1 },
          y: -100, opacity: 0.5,
        });
      }

      // Social link hover
      const socialEls = gsap.utils.toArray('.social-link-item') as HTMLElement[];
      socialEls.forEach((el) => {
        el.addEventListener('mouseenter', () => {
          gsap.to(el, { x: 8, color: '#FF2800', duration: 0.3, ease: 'power2.out' });
        });
        el.addEventListener('mouseleave', () => {
          gsap.to(el, { x: 0, color: '#1a1a1a', duration: 0.3, ease: 'power2.out' });
        });
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const result = await submitContactForm({
      ...formData,
      subject: activeInquiry || formData.subject || 'General',
    });

    if (result.success) {
      setStatus('success');
      requestAnimationFrame(() => {
        const successEl = document.querySelector('.success-overlay');
        if (successEl) {
          gsap.fromTo(successEl, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' });
        }
      });
      setTimeout(() => {
        setStatus('idle');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setActiveInquiry('');
      }, 5000);
    } else {
      setStatus('error');
      setErrorMsg(result.error || 'Something went wrong.');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <div
      ref={mainRef}
      className="min-h-screen bg-white text-[#1a1a1a] font-sans selection:bg-[#FF2800] selection:text-white overflow-x-hidden"
    >
      {/* ═══ Hero Header ═══ */}
      <header className="relative pt-32 md:pt-40 pb-20 md:pb-28 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto min-h-[70vh] flex flex-col justify-end">
        <div ref={bigTextRef} className="absolute top-0 left-0 w-full pointer-events-none -z-10 overflow-hidden select-none">
          <h2 className="text-[22vw] leading-[0.8] serif-font font-bold text-[#1a1a1a] opacity-[0.03] translate-y-[10%]">
            CONTACT
          </h2>
        </div>

        <div ref={titleRef}>
          <div className="overflow-hidden mb-1">
            <span className="serif-font italic text-sm text-[#FF2800] block">
              {settings.availability_label}
            </span>
          </div>
          <div className="overflow-hidden">
            <h1 className="text-7xl md:text-8xl lg:text-9xl serif-font leading-[0.9] tracking-tight">
              Let&apos;s craft
            </h1>
          </div>
          <div className="overflow-hidden">
            <h1 className="text-7xl md:text-8xl lg:text-9xl serif-font leading-[0.9] tracking-tight">
              <span className="italic">something</span>{' '}
              <span className="text-[#FF2800]">rare.</span>
            </h1>
          </div>
          <div className="overflow-hidden mt-8 md:mt-12">
            <p className="text-gray-500 text-lg md:text-xl font-light max-w-lg leading-relaxed">
              Have a project in mind? Drop me a line and let&apos;s build something{' '}
              <span className="text-[#1a1a1a] font-normal border-b-2 border-[#FF2800]">unforgettable</span>.
            </p>
          </div>
        </div>
      </header>

      {/* ═══ Main Content ═══ */}
      <main className="relative px-6 md:px-12 lg:px-24 max-w-7xl mx-auto pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">

          {/* ─── Left Column: Info ─── */}
          <div ref={infoRef} className="order-2 lg:order-1 lg:col-span-5 space-y-16">
            {/* Email */}
            <div className="reveal-section">
              <h3 className="serif-font italic text-sm text-gray-400 mb-8 border-b border-gray-100 pb-4">Contact Details</h3>
              <a href={`mailto:${settings.email}`} className="group block" target="_blank" rel="noopener noreferrer">
                <div className="flex items-center gap-6 mb-2">
                  <div className="w-12 h-12 border border-gray-200 flex items-center justify-center group-hover:bg-[#FF2800] group-hover:border-[#FF2800] transition-colors duration-300">
                    <svg className="w-5 h-5 text-gray-900 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-2xl serif-font group-hover:text-[#FF2800] transition-colors duration-300">
                    {settings.email}
                  </span>
                </div>
                <p className="text-sm text-gray-400 pl-[4.5rem]">{settings.response_time}</p>
              </a>

              <div className="flex items-center gap-6 mt-6">
                <div className="w-12 h-12 border border-gray-200 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <span className="text-2xl serif-font">{settings.location}</span>
                  <p className="text-sm text-gray-400">{settings.location_note}</p>
                </div>
              </div>
            </div>

            {/* Socials */}
            <div className="reveal-section">
              <h3 className="serif-font italic text-sm text-gray-400 mb-8 border-b border-gray-100 pb-4">Connect</h3>
              <div className="space-y-0">
                {settings.social_links.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target={link.url.startsWith('http') ? '_blank' : undefined}
                    rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="social-link-item flex items-center justify-between py-5 border-b border-gray-100 group cursor-pointer"
                  >
                    <span className="font-medium tracking-wide text-lg">{link.name}</span>
                    <svg className="w-4 h-4 text-[#FF2800] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="reveal-section hidden lg:block">
              <h3 className="serif-font italic text-sm text-gray-400 mb-8 border-b border-gray-100 pb-4">What I Offer</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs font-semibold tracking-wide uppercase text-gray-900">
                {settings.skills.map((item) => (
                  <div key={item} className="hover:text-[#FF2800] transition-colors cursor-default">{item}</div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── Right Column: Form ─── */}
          <div ref={formRef} className="order-1 lg:order-2 lg:col-span-7">
            <div className="bg-[#fafafa] border border-gray-100 p-8 md:p-12 relative overflow-hidden">

              {status === 'success' && (
                <div className="success-overlay absolute inset-0 bg-white z-20 flex flex-col items-center justify-center text-center p-8">
                  <div className="mb-6">
                    <svg className="w-16 h-16 text-[#FF2800]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-4xl serif-font mb-4">Message Sent</h2>
                  <p className="text-gray-500 font-light">I&apos;ll get back to you within 24 hours.</p>
                </div>
              )}

              {status === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm">{errorMsg}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="relative group">
                    <input required type="text" className="peer w-full bg-transparent border-b border-gray-200 py-4 pt-6 focus:outline-none focus:border-[#FF2800] transition-colors serif-font text-xl placeholder-transparent" placeholder="Name" id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    <label htmlFor="name" className="absolute left-0 top-0 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-[0.2em] peer-focus:font-bold peer-focus:text-[#FF2800]">Full Name</label>
                  </div>
                  <div className="relative group">
                    <input required type="email" className="peer w-full bg-transparent border-b border-gray-200 py-4 pt-6 focus:outline-none focus:border-[#FF2800] transition-colors serif-font text-xl placeholder-transparent" placeholder="Email" id="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    <label htmlFor="email" className="absolute left-0 top-0 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-[0.2em] peer-focus:font-bold peer-focus:text-[#FF2800]">Email Address</label>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-4">Inquiry Type</label>
                  <div className="flex flex-wrap gap-2">
                    {inquiryTypes.map((type) => (
                      <button key={type.value} type="button" onClick={() => setActiveInquiry(activeInquiry === type.value ? '' : type.value)}
                        className={`px-5 py-2.5 text-xs font-bold tracking-[0.05em] uppercase transition-all duration-300 border ${activeInquiry === type.value ? 'bg-[#FF2800] text-white border-[#FF2800]' : 'bg-transparent text-gray-600 border-gray-200 hover:border-[#FF2800] hover:text-[#FF2800]'}`}>
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative group">
                  <textarea required rows={4} className="peer w-full bg-transparent border-b border-gray-200 py-4 pt-8 focus:outline-none focus:border-[#FF2800] transition-colors serif-font text-xl resize-none placeholder-transparent" placeholder="Message" id="message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
                  <label htmlFor="message" className="absolute left-0 top-0 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 transition-all peer-placeholder-shown:top-8 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-[0.2em] peer-focus:font-bold peer-focus:text-[#FF2800]">Tell me about your project</label>
                </div>

                <button type="submit" disabled={status === 'submitting'} className="group relative inline-flex items-center h-14 overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed">
                  <span className="absolute inset-0 bg-[#FF2800]" />
                  <span className="absolute inset-0 bg-[#1a1a1a] origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]" />
                  <span className="relative z-10 text-white text-xs font-bold tracking-widest uppercase pl-8 pr-2 group-hover:pl-7 transition-all duration-500 ease-out">
                    {status === 'submitting' ? 'Sending...' : 'Send Inquiry'}
                  </span>
                  <span className="relative z-10 flex items-center justify-center w-10 h-10 mr-2 bg-white/20 group-hover:bg-white transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110">
                    {status === 'submitting' ? (
                      <svg className="w-4 h-4 text-white group-hover:text-[#1a1a1a] animate-spin transition-colors duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-white group-hover:text-[#1a1a1a] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16m0 0l-6-6m6 6l-6 6" />
                      </svg>
                    )}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* ═══ Bottom CTA ═══ */}
      <section className="py-20 md:py-28 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto text-center">
        <p className="serif-font italic text-sm text-gray-400 mb-6">Prefer email?</p>
        <a href={`mailto:${settings.email}`} className="group inline-block serif-font italic text-3xl sm:text-4xl md:text-6xl text-[#1a1a1a] hover:text-[#FF2800] transition-colors duration-300 relative">
          {settings.email}
          <span className="absolute left-0 -bottom-2 w-0 group-hover:w-full h-[2px] bg-[#FF2800] transition-all duration-500" />
        </a>
      </section>

      <Footer />
    </div>
  );
}
