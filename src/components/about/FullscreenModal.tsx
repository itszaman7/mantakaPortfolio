"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { X } from "lucide-react";
import { ImageCarousel } from "./ImageCarousel";
import type { Milestone } from "@/lib/milestonesData";

if (typeof window !== "undefined") {
  gsap.registerPlugin();
}

interface FullscreenModalProps {
  milestone: Milestone;
  onClose: () => void;
}

export function FullscreenModal({ milestone, onClose }: FullscreenModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    document.body.style.overflow = "hidden";
    const ctx = gsap.context(() => {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power2.out" }
      );
      gsap.fromTo(
        contentRef.current,
        { y: 100, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.2)", delay: 0.1 }
      );
    });
    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, []);

  const handleClose = () => {
    if (!overlayRef.current || !contentRef.current) {
      onClose();
      return;
    }
    gsap.to(contentRef.current, {
      y: 50,
      opacity: 0,
      scale: 0.95,
      duration: 0.3,
      ease: "power2.in",
    });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
      delay: 0.1,
      onComplete: onClose,
    });
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-md p-4 opacity-0"
      onClick={handleClose}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        className="absolute top-6 right-6 p-2 bg-neutral-100 rounded-full hover:bg-neutral-200 transition-colors z-50 group"
      >
        <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>

      <div
        ref={contentRef}
        className="w-full max-w-6xl h-[85vh] grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-y-auto bg-white shadow-2xl rounded-3xl border border-neutral-100 p-2 opacity-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full h-full flex flex-col justify-center bg-neutral-50 rounded-2xl overflow-hidden p-4">
          <ImageCarousel
            images={milestone.images}
            title={milestone.title}
            className="aspect-[4/3] w-full shadow-lg rounded-xl h-full"
          />
        </div>
        <div className="flex flex-col justify-center p-8 lg:pr-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="px-4 py-1.5 text-sm font-bold tracking-widest text-white bg-black uppercase rounded-sm shadow-lg shadow-red-500/20">
              {milestone.year}
            </div>
            <div className="h-px flex-grow bg-neutral-200" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-neutral-900 mb-6 leading-[0.9] tracking-tight">
            {milestone.title}
          </h2>
          <p className="text-lg md:text-xl text-neutral-500 font-light leading-relaxed mb-10">
            {milestone.description}
          </p>
          <div className="mt-auto">
            <h4 className="text-xs uppercase tracking-[0.2em] text-neutral-400 font-bold mb-4">
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {milestone.tags?.map((tag, i) => (
                <span
                  key={i}
                  className="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 border border-neutral-200 rounded-md hover:bg-neutral-200 hover:scale-105 transition-all cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
