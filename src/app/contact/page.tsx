'use client';

import React, { useState, useRef, useLayoutEffect } from 'react';
import {
  ArrowRight,
  Mail,
  MapPin,
  Instagram,
  Twitter,
  Linkedin,
  Github,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '@/components/Footer';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const EMAIL = 'mantaka35@gmail.com';

const socialLinksList = [
  { name: 'Instagram', icon: Instagram, url: '#' },
  { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/in/mantaka' },
  { name: 'Twitter', icon: Twitter, url: '#' },
  { name: 'GitHub', icon: Github, url: 'https://github.com/itszaman7' },
];

const ferrariRed = '#FF2800';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const mainRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!titleRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(titleRef.current!.children, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power4.out',
        delay: 0.2,
      });

      if (infoRef.current) {
        gsap.from(infoRef.current.children, {
          scrollTrigger: {
            trigger: infoRef.current,
            start: 'top 80%',
          },
          x: -50,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
        });
      }

      if (formRef.current) {
        gsap.from(formRef.current, {
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 75%',
          },
          x: 50,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          delay: 0.2,
        });
      }

      const socialLinks = gsap.utils.toArray('.social-link');
      socialLinks.forEach((link) => {
        const el = link as HTMLElement;
        const icon = el.querySelector('.social-icon');
        const arrow = el.querySelector('.arrow-icon');

        el.addEventListener('mouseenter', () => {
          gsap.to(el, { backgroundColor: '#fff9f8', borderColor: ferrariRed, duration: 0.3 });
          gsap.to(icon, { color: ferrariRed, scale: 1.1, duration: 0.3 });
          gsap.to(arrow, { x: 0, opacity: 1, duration: 0.3 });
        });

        el.addEventListener('mouseleave', () => {
          gsap.to(el, { backgroundColor: 'transparent', borderColor: '#f3f4f6', duration: 0.3 });
          gsap.to(icon, { color: '#1a1a1a', scale: 1, duration: 0.3 });
          gsap.to(arrow, { x: -10, opacity: 0, duration: 0.3 });
        });
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    gsap.fromTo(
      '.success-message',
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
    );

    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <div
      ref={mainRef}
      className="min-h-screen bg-white text-[#1a1a1a] font-sans selection:bg-[#FF2800] selection:text-white overflow-x-hidden"
    >
      <main className="pt-20 pb-20 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <header className="mb-24">
          <div ref={titleRef}>
            <div className="overflow-hidden">
              <span className="serif-font italic text-sm text-[#FF2800] mb-4 block">
                Available for Commissions
              </span>
            </div>
            <div className="overflow-hidden">
              <h1 className="text-7xl md:text-9xl serif-font font-medium leading-[0.9] tracking-tight">
                Let&apos;s craft
              </h1>
            </div>
            <div className="overflow-hidden">
              <h1 className="text-7xl md:text-9xl serif-font font-medium leading-[0.9] tracking-tight">
                <span className="italic">something</span>{' '}
                <span className="text-[#FF2800]">rare.</span>
              </h1>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          <div ref={infoRef} className="lg:col-span-5 space-y-16">
            <section>
              <h3 className="serif-font italic text-sm text-gray-400 mb-8 border-b border-gray-100 pb-4">
                Contact Details
              </h3>
              <div className="space-y-6">
                <a
                  href={`mailto:${EMAIL}`}
                  className="group block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex items-center gap-6 mb-2">
                    <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-[#FF2800] group-hover:border-[#FF2800] transition-colors duration-300">
                      <Mail size={20} className="text-gray-900 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <span className="text-2xl serif-font group-hover:text-[#FF2800] transition-colors duration-300">
                      {EMAIL}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 pl-[4.5rem]">Average response: 24h</p>
                </a>

                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center">
                    <MapPin size={20} className="text-gray-900" />
                  </div>
                  <span className="text-2xl serif-font">Remote</span>
                </div>
              </div>
            </section>

            <section>
              <h3 className="serif-font italic text-sm text-gray-400 mb-8 border-b border-gray-100 pb-4">
                Connect
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {socialLinksList.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.name}
                      href={link.url}
                      target={link.url.startsWith('http') ? '_blank' : undefined}
                      rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="social-link flex items-center justify-between p-5 border border-gray-100 rounded-sm group cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <span className="social-icon text-gray-900 transition-transform duration-300">
                          <Icon size={20} />
                        </span>
                        <span className="font-medium tracking-wide">{link.name}</span>
                      </div>
                      <span className="arrow-icon text-[#FF2800] opacity-0 -translate-x-2 inline-block">
                        <ArrowRight size={18} />
                      </span>
                    </a>
                  );
                })}
              </div>
            </section>
          </div>

          <div ref={formRef} className="lg:col-span-7">
            <div className="bg-[#fcfcfc] border border-gray-100 p-8 md:p-12 relative overflow-hidden h-full">
              {isSubmitted && (
                <div className="success-message absolute inset-0 bg-white z-20 flex flex-col items-center justify-center text-center p-8">
                  <div className="mb-6">
                    <CheckCircle2 size={64} color={ferrariRed} />
                  </div>
                  <h2 className="text-4xl serif-font mb-4">Message Sent</h2>
                  <p className="text-gray-500 font-light">I will get back to you shortly.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="relative group">
                    <input
                      required
                      type="text"
                      className="peer w-full bg-transparent border-b border-gray-200 py-4 pt-6 focus:outline-none focus:border-[#FF2800] transition-colors serif-font text-xl placeholder-transparent"
                      placeholder="Name"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <label
                      htmlFor="name"
                      className="absolute left-0 top-0 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-[0.2em] peer-focus:font-bold peer-focus:text-[#FF2800]"
                    >
                      Full Name
                    </label>
                  </div>
                  <div className="relative group">
                    <input
                      required
                      type="email"
                      className="peer w-full bg-transparent border-b border-gray-200 py-4 pt-6 focus:outline-none focus:border-[#FF2800] transition-colors serif-font text-xl placeholder-transparent"
                      placeholder="Email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-0 top-0 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-[0.2em] peer-focus:font-bold peer-focus:text-[#FF2800]"
                    >
                      Email Address
                    </label>
                  </div>
                </div>

                <div className="relative group">
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2 group-focus-within:text-[#FF2800] transition-colors">
                    Inquiry Type
                  </label>
                  <div className="relative">
                    <select
                      className="w-full bg-transparent border-b border-gray-200 py-4 pr-10 focus:outline-none focus:border-[#FF2800] transition-colors serif-font text-xl appearance-none cursor-pointer relative z-10"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    >
                      <option value="" disabled>
                        Select a category
                      </option>
                      <option value="web">Web Development</option>
                      <option value="branding">Brand Identity</option>
                      <option value="uiux">UI/UX Design</option>
                      <option value="other">Other Inquiry</option>
                    </select>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-[#FF2800] transition-colors">
                      <ChevronDown size={20} />
                    </div>
                  </div>
                </div>

                <div className="relative group">
                  <textarea
                    required
                    rows={4}
                    className="peer w-full bg-transparent border-b border-gray-200 py-4 pt-8 focus:outline-none focus:border-[#FF2800] transition-colors serif-font text-xl resize-none placeholder-transparent"
                    placeholder="Message"
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                  <label
                    htmlFor="message"
                    className="absolute left-0 top-0 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 transition-all peer-placeholder-shown:top-8 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-[0.2em] peer-focus:font-bold peer-focus:text-[#FF2800]"
                  >
                    Tell me about your project
                  </label>
                </div>

                <button
                  type="submit"
                  className="group relative w-full md:w-auto inline-flex items-center justify-between gap-12 bg-[#FF2800] text-white px-10 py-6 overflow-hidden transition-all duration-300"
                  onMouseEnter={(e) => {
                    const bg = e.currentTarget.querySelector('.btn-bg');
                    if (bg) gsap.to(bg, { y: '0%', duration: 0.4, ease: 'power2.out' });
                  }}
                  onMouseLeave={(e) => {
                    const bg = e.currentTarget.querySelector('.btn-bg');
                    if (bg) gsap.to(bg, { y: '100%', duration: 0.4, ease: 'power2.in' });
                  }}
                >
                  <span className="relative z-10 font-bold uppercase tracking-widest text-xs">
                    Send Inquiry
                  </span>
                  <ArrowRight size={18} className="relative z-10" />
                  <div className="btn-bg absolute inset-0 bg-[#d12100] translate-y-full pointer-events-none" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />

    </div>
  );
}
