"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Project, getProjectBackgroundColor } from "./projectsData";
import { ArrowRight } from "lucide-react";

/** Extract a dominant color from an image for the ambient glow. */
function getDominantColor(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new window.Image();
        if (url.startsWith("http")) img.crossOrigin = "anonymous";
        img.onload = () => {
            try {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                if (!ctx) { reject(new Error("Canvas not available")); return; }
                const size = 32;
                canvas.width = size;
                canvas.height = size;
                ctx.drawImage(img, 0, 0, size, size);
                const data = ctx.getImageData(0, 0, size, size).data;
                let r = 0, g = 0, b = 0;
                const count = (data.length / 4) | 0;
                for (let i = 0; i < data.length; i += 4) {
                    r += data[i];
                    g += data[i + 1];
                    b += data[i + 2];
                }
                r = Math.round(r / count);
                g = Math.round(g / count);
                b = Math.round(b / count);
                // Boost saturation slightly so the glow has character
                const max = Math.max(r, g, b);
                const min = Math.min(r, g, b);
                if (max - min < 30) {
                    // Very desaturated image — use a warm neutral
                    resolve("#FF2800");
                } else {
                    resolve(`rgb(${r},${g},${b})`);
                }
            } catch { reject(new Error("Color extraction failed")); }
        };
        img.onerror = () => reject(new Error("Image load failed"));
        img.src = url;
    });
}

interface ProjectCardProps {
    project: Project;
    index: number;
    className?: string;
}

const DEFAULT_IMAGE = "/placeholder.png";

const ProjectCard = ({ project, index, className = "" }: ProjectCardProps) => {
    const imageUrl =
        project.src || (project.media?.length && project.media[0].type === "image"
            ? project.media[0].url
            : DEFAULT_IMAGE);

    const indexStr = String(index).padStart(2, "0");

    // Determine the project's theme color
    const fallbackColor = getProjectBackgroundColor(project, index - 1);
    const [glowColor, setGlowColor] = useState<string>(project.backgroundColor ?? fallbackColor);

    useEffect(() => {
        // If no explicit color, try to extract from image
        if (!project.backgroundColor && imageUrl !== DEFAULT_IMAGE) {
            getDominantColor(imageUrl)
                .then(setGlowColor)
                .catch(() => setGlowColor(fallbackColor));
        }
    }, [imageUrl, project.backgroundColor, fallbackColor]);

    return (
        <section className={`min-h-screen w-full flex items-center justify-center p-4 md:p-12 ${className}`}>
            <div
                className="card-inner relative overflow-hidden rounded-[32px] md:rounded-[40px] border border-black/[0.06] bg-white/90 backdrop-blur-2xl w-full max-w-6xl shadow-[0_8px_60px_-12px_rgba(0,0,0,0.08)] group transition-all duration-500"
                style={{
                    height: "auto",
                    minHeight: "min(520px, 75vh)",
                }}
            >
                {/* Radial glow — project's theme color, spread across the card */}
                <div
                    className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-700"
                    style={{
                        background: `
                            radial-gradient(ellipse 90% 80% at 75% 40%, ${glowColor}50 0%, transparent 65%),
                            radial-gradient(ellipse 80% 90% at 30% 70%, ${glowColor}30 0%, transparent 60%),
                            radial-gradient(ellipse 120% 100% at 50% 50%, ${glowColor}15 0%, transparent 80%)
                        `,
                    }}
                />

                {/* Subtle noise texture */}
                <div
                    className="absolute inset-0 opacity-[0.015] pointer-events-none z-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
                    }}
                />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 h-full min-h-[inherit]">
                    {/* Left — Text Content */}
                    <div className="p-8 md:p-14 lg:p-16 flex flex-col justify-center order-2 lg:order-1">
                        {/* Index number — uses project color */}
                        <div
                            className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 opacity-30 serif-font"
                            style={{ color: glowColor }}
                        >
                            {indexStr}
                        </div>

                        {/* Title */}
                        <h2 className="text-3xl md:text-5xl font-bold text-[#1a1a1a] mb-3 md:mb-5 leading-tight tracking-tight serif-font">
                            {project.title}
                        </h2>

                        {/* Category / Subtitle — vivid project color */}
                        {(project.subtitle || project.category) && (
                            <p
                                className="serif-font italic text-sm mb-6 md:mb-8"
                                style={{ color: glowColor }}
                            >
                                {project.subtitle || project.category}
                            </p>
                        )}

                        {/* Description */}
                        <p className="text-neutral-500 text-base md:text-lg leading-relaxed mb-8 md:mb-10 max-w-md">
                            {project.introduction}
                        </p>

                        {/* Tech stack pills */}
                        {project.techStack && project.techStack.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-8 md:mb-10">
                                {project.techStack.slice(0, 5).map((tech) => (
                                    <span
                                        key={tech}
                                        className="px-3 py-1 rounded-full border border-black/[0.06] text-neutral-400 text-xs tracking-wide"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* CTA Button — project color */}
                        <div>
                            {project.slug ? (
                                <Link
                                    href={`/work/${project.slug}`}
                                    className="group/btn inline-flex items-center gap-3 h-12 md:h-14 px-7 md:px-9 rounded-full text-sm md:text-base font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-lg"
                                    style={{
                                        backgroundColor: glowColor,
                                        boxShadow: `0 8px 32px ${glowColor}30`,
                                    }}
                                >
                                    <span>View Project</span>
                                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                                </Link>
                            ) : (
                                <button
                                    disabled
                                    className="inline-flex items-center gap-3 h-12 md:h-14 px-7 md:px-9 rounded-full bg-neutral-100 text-neutral-400 text-sm md:text-base font-semibold cursor-not-allowed"
                                >
                                    <span>Coming Soon</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right — Visual / Image */}
                    <div className="relative min-h-[250px] lg:min-h-0 border-b lg:border-b-0 lg:border-l border-black/[0.04] flex items-center justify-center overflow-hidden order-1 lg:order-2">
                        {/* Subtle grid pattern */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:40px_40px] opacity-50" />

                        {/* Ambient glow behind image — project color */}
                        <div
                            className="absolute w-80 h-80 blur-[100px] transition-opacity duration-700 group-hover:opacity-[0.18]"
                            style={{ backgroundColor: glowColor, opacity: 0.1 }}
                        />

                        {/* Project image */}
                        <div className="relative w-[85%] aspect-[16/10] rounded-2xl overflow-hidden shadow-xl border border-black/[0.04] project-image-container transition-transform duration-700 group-hover:scale-[1.03]">
                            <Image
                                src={imageUrl}
                                alt={project.title}
                                fill
                                className="object-cover transition-all duration-700 group-hover:scale-105"
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
            </div>
        </section>
    );
};

export default ProjectCard;