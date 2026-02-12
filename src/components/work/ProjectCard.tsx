"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from 'next/link';
import { Project } from "./projectsData";
import { getProjectBackgroundColor } from "./projectsData";
import { ArrowRight } from "lucide-react";

/** Extract a dominant tint from an image URL for use as card background. */
function getDominantColorFromImageUrl(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new window.Image();
        if (url.startsWith("http")) img.crossOrigin = "anonymous";
        img.onload = () => {
            try {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    reject(new Error("Canvas not available"));
                    return;
                }
                const size = 32;
                canvas.width = size;
                canvas.height = size;
                ctx.drawImage(img, 0, 0, size, size);
                const data = ctx.getImageData(0, 0, size, size).data;
                let r = 0,
                    g = 0,
                    b = 0;
                const count = (data.length / 4) | 0;
                for (let i = 0; i < data.length; i += 4) {
                    r += data[i];
                    g += data[i + 1];
                    b += data[i + 2];
                }
                r = Math.round(r / count);
                g = Math.round(g / count);
                b = Math.round(b / count);
                // Lighten so it works as a readable card background (tinted pastel)
                const mix = 0.75; // Increased mix for lighter pastels
                r = Math.round(r * mix + 255 * (1 - mix));
                g = Math.round(g * mix + 255 * (1 - mix));
                b = Math.round(b * mix + 255 * (1 - mix));
                const hex =
                    "#" +
                    [r, g, b]
                        .map((x) =>
                            Math.min(255, Math.max(0, x))
                                .toString(16)
                                .padStart(2, "0")
                        )
                        .join("");
                resolve(hex);
            } catch (e) {
                reject(e);
            }
        };
        img.onerror = () => reject(new Error("Image load failed"));
        img.src = url;
    });
}

/**
 * Calculate the relative luminance of a color.
 * Returns a value between 0 (black) and 1 (white).
 */
function getLuminance(hex: string): number {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;

    // SMPTE C, Rec. 709 weightings
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

interface ProjectCardProps {
    project: Project;
    index: number;
    className?: string;
}

const DEFAULT_IMAGE = "/placeholder.png";

const ProjectCard = ({ project, index, className = "" }: ProjectCardProps) => {
    const imageUrl =
        project.media?.length && project.media[0].type === "image"
            ? project.media[0].url
            : project.src || DEFAULT_IMAGE;

    const [imageColor, setImageColor] = useState<string | null>(null);
    const hasImage = !!(project.src || (project.media?.length && project.media[0].type === "image"));
    const useImageColor = hasImage && !project.backgroundColor;

    useEffect(() => {
        if (!useImageColor || imageUrl === DEFAULT_IMAGE) return;
        getDominantColorFromImageUrl(imageUrl)
            .then(setImageColor)
            .catch(() => setImageColor(null));
    }, [imageUrl, useImageColor]);

    const fallbackBg = getProjectBackgroundColor(project, index - 1);
    const bgColor = project.backgroundColor ?? imageColor ?? fallbackBg;
    const indexStr = String(index).padStart(2, "0");

    const dark = getLuminance(bgColor) < 0.5;

    return (
        <section className={`min-h-screen w-full flex items-center justify-center p-4 md:p-6 ${className}`}>
            <div
                className="w-[98%] md:w-[94%] h-[85vh] md:h-[90vh] rounded-[40px] md:rounded-[64px] overflow-hidden shadow-[0_40px_120px_-30px_rgba(0,0,0,0.4)] relative flex items-center p-8 md:p-16 lg:p-24"
                style={{ backgroundColor: bgColor }}
            >
                <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                    <div className="flex flex-col gap-8 relative z-10 order-2 lg:order-1">
                        <div className="space-y-4">
                            <div className={`text-4xl md:text-6xl font-black opacity-30 ${dark ? "text-white" : "text-black"}`}>
                                {indexStr}
                            </div>
                            <h2 className={`text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] ${dark ? "text-white" : "text-neutral-900"}`}>
                                {project.title}
                            </h2>
                            <p className={`text-xl md:text-3xl font-bold tracking-tight ${dark ? "text-white/80" : "text-neutral-800"}`}>
                                {project.subtitle || project.category}
                            </p>
                        </div>

                        <p className={`text-lg md:text-xl leading-relaxed max-w-md font-medium opacity-70 ${dark ? "text-white" : "text-neutral-600"}`}>
                            {project.description}
                        </p>

                        <div className="pt-2">
                            {project.slug ? (
                                <Link
                                    href={`/work/${project.slug}`}
                                    className={`group inline-flex items-center justify-center h-16 md:h-20 px-10 md:px-14 rounded-full font-black text-xl md:text-2xl transition-all shadow-xl ${dark ? "bg-white text-black hover:bg-neutral-100" : "bg-black text-white hover:bg-neutral-800"}`}
                                >
                                    <span>View Project</span>
                                    <ArrowRight className="ml-3 w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-2 transition-transform" />
                                </Link>
                            ) : (
                                <button
                                    disabled
                                    className={`inline-flex items-center justify-center h-16 md:h-20 px-10 md:px-14 rounded-full font-black text-xl md:text-2xl opacity-60 cursor-not-allowed ${dark ? "bg-white/50 text-black" : "bg-neutral-400 text-white"}`}
                                >
                                    <span>Coming Soon</span>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="relative aspect-[4/3] rounded-[32px] md:rounded-[48px] overflow-hidden shadow-2xl border-[12px] border-white/10 order-1 lg:order-2 project-image-container">
                        <Image
                            src={imageUrl}
                            alt={project.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            priority={index === 1}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = DEFAULT_IMAGE;
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProjectCard;