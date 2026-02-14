"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const socialLinks = [
  { name: "LinkedIn", url: "https://linkedin.com/in/mantaka" },
  { name: "GitHub", url: "https://github.com/itszaman7" },
  { name: "WhatsApp", url: "https://wa.me/8801778961590" },
  { name: "Telegram", url: "#" },
  { name: "Instagram", url: "#" },
];

// Greetings: outline = true means hollow/stroke style. More languages.
const greetings: { text: string; outline: boolean }[] = [
  { text: "HI", outline: true },
  { text: "HELLO!", outline: false },
  { text: "HEY", outline: true },
  { text: "مرحبا", outline: false },
  { text: "OLÁ!", outline: false },
  { text: "HOLA", outline: true },
  { text: "BONJOUR", outline: false },
  { text: "CIAO", outline: true },
  { text: "你好", outline: false },
  { text: "こんにちは", outline: true },
  { text: "NAMASTE", outline: false },
  { text: "HALLO", outline: true },
  { text: "HEJ", outline: false },
  { text: "SALUT", outline: true },
  { text: "Привет", outline: false },
  { text: "CZEŚĆ", outline: true },
  { text: "MERHABA", outline: false },
  { text: "안녕", outline: true },
];

function MarqueeContent() {
  return (
    <>
      {greetings.map((g, i) => (
        <span
          key={`${i}-${g.text}`}
          className={
            g.outline
              ? "footer-greeting-outline text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-neutral-900 whitespace-nowrap"
              : "text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-neutral-900 whitespace-nowrap"
          }
        >
          {g.text}
        </span>
      ))}
    </>
  );
}

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLAnchorElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const copyrightRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (!footerRef.current || !innerRef.current) return;

      const tl = gsap.timeline({ paused: true });

      // Footer container: slide up + fade in on scroll
      tl.fromTo(
        innerRef.current,
        { y: 48, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        0
      );
      if (emailRef.current) {
        tl.fromTo(
          emailRef.current,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
          0.15
        );
      }
      if (dividerRef.current) {
        tl.fromTo(
          dividerRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.5, ease: "power2.out" },
          0.2
        );
      }
      if (socialsRef.current) {
        const links = socialsRef.current.querySelectorAll("a");
        tl.fromTo(
          links,
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, stagger: 0.04, ease: "power2.out" },
          0.25
        );
      }
      if (logoRef.current) {
        tl.fromTo(
          logoRef.current,
          { x: 16, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
          0.3
        );
      }
      if (copyrightRef.current) {
        tl.fromTo(
          copyrightRef.current,
          { y: 8, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" },
          0.35
        );
      }

      ScrollTrigger.create({
        trigger: footerRef.current,
        start: "top 88%",
        onEnter: () => tl.restart(),
        onLeaveBack: () => {
          tl.progress(0);
          tl.pause();
        },
      });
    },
    { scope: footerRef }
  );

  return (
    <footer
      ref={footerRef}
      className="relative z-10 w-full font-sans bg-[#f4f4f5] text-neutral-900 selection:bg-red-600 selection:text-white overflow-hidden"
    >
      <div ref={innerRef}>
      {/* Marquee: greetings left to right */}
      <div className="pt-16 md:pt-20 pb-4">
        <div className="flex overflow-hidden">
          <div className="footer-marquee-track flex items-center gap-x-8 md:gap-x-12 shrink-0">
            <MarqueeContent />
            <MarqueeContent />
          </div>
        </div>
        {/* Red wavy line under marquee (theme accent) */}
        <div className="mt-2 flex justify-center">
          <svg
            className="w-full max-w-md h-3"
            style={{ color: "var(--accent-pulse)" }}
            viewBox="0 0 400 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="M0 8 Q50 2, 100 8 T200 8 T300 8 T400 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M0 10 Q60 4, 120 10 T240 10 T360 10 T400 10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
            />
          </svg>
        </div>
      </div>

      {/* Email CTA */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 pt-12 pb-16">
        <div className="flex justify-center md:justify-start">
          <a
            ref={emailRef}
            href="mailto:mantaka35@gmail.com"
            className="inline-block px-8 py-4 rounded-2xl border-2 border-neutral-900 text-neutral-900 text-sm md:text-base font-bold uppercase tracking-widest transition-all duration-300 hover:bg-red-600 hover:border-red-600 hover:text-white hover:scale-105 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-600/20"
          >
            HELLO@MANTAKA.DESIGN
          </a>
        </div>
      </div>

      {/* Divider */}
      <div ref={dividerRef} className="w-full max-w-[1440px] mx-auto px-6 md:px-12 origin-left">
        <div className="h-px bg-neutral-300" />
      </div>

      {/* Socials + Logo */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-10 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0">
          <div
            ref={socialsRef}
            className="flex flex-wrap justify-center md:justify-start gap-x-8 md:gap-x-10 gap-y-2"
          >
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link inline-flex text-base md:text-lg font-bold uppercase tracking-[0.2em] text-neutral-700"
              >
                {link.name.split("").map((char, i) => (
                  <span
                    key={`${link.name}-${i}`}
                    className="footer-social-letter"
                    style={{ ["--i" as string]: i }}
                  >
                    {char}
                  </span>
                ))}
              </a>
            ))}
          </div>
          <div
            ref={logoRef}
            className="footer-logo-link flex text-2xl md:text-3xl font-black uppercase tracking-tighter text-neutral-900"
          >
            {"Mantaka".split("").map((char, i) => (
              <span
                key={`logo-${i}`}
                className="footer-logo-letter"
                style={{ ["--i" as string]: i }}
              >
                {char}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-center md:justify-end mt-10 pt-8 border-t border-neutral-200">
          <p
            ref={copyrightRef}
            className="footer-copyright"
          >
            {"Copyright 2026 © Mantaka".split("").map((char, i) => (
              <span
                key={`copy-${i}`}
                className="footer-copyright-letter"
                style={{ ["--i" as string]: i }}
              >
                {char}
              </span>
            ))}
          </p>
        </div>
      </div>
      </div>
    </footer>
  );
}
