"use client";

import Image from "next/image";
import { Project } from "./projectsData";
import { getProjectBackgroundColor } from "./projectsData";

interface ProjectCardProps {
    project: Project;
    index: number;
    className?: string;
}

const ProjectCard = ({ project, index, className = "" }: ProjectCardProps) => {
    const imageUrl =
        project.media?.length && project.media[0].type === "image"
            ? project.media[0].url
            : project.src;
    const subtitle = project.subtitle ?? project.category;
    const bgColor = getProjectBackgroundColor(project, index - 1);
    const indexStr = String(index).padStart(2, "0");

    return (
        <section
            className={`min-h-screen w-full flex flex-col md:flex-row items-stretch ${className}`}
            style={{ backgroundColor: bgColor }}
        >
            {/* Left column: title, number, subtitle, description, CTA */}
            <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-24 py-16 md:py-24 min-w-0 md:max-w-[60%]">
                <h2 className="font-space-grotesk text-5xl md:text-6xl lg:text-7xl font-bold text-neutral-900 tracking-tight leading-[0.95] mb-4">
                    {project.title}
                </h2>
                <p className="font-space-grotesk text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 tracking-tight mb-4">
                    {indexStr}
                </p>
                <p className="font-space-grotesk text-base md:text-lg text-neutral-700 font-medium mb-6">
                    {subtitle}
                </p>
                <p className="font-space-grotesk text-sm md:text-base text-neutral-600 leading-relaxed max-w-xl mb-10 line-clamp-3">
                    {project.description}
                </p>
                <div className="flex items-center gap-3">
                    <span className="font-space-grotesk text-base font-bold text-neutral-900">
                        See what we create
                    </span>
                    {project.link ? (
                        <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 flex items-center justify-center bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all duration-200 group/btn"
                            aria-label="View project"
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="group-hover/btn:translate-x-0.5 transition-transform"
                            >
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </a>
                    ) : (
                        <span className="w-12 h-12 flex items-center justify-center bg-white rounded-xl border border-neutral-200 shadow-sm opacity-60 cursor-not-allowed">
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </span>
                    )}
                </div>
            </div>

            {/* Right column: single image */}
            <div className="flex-1 relative min-h-[50vh] md:min-h-full md:max-w-[45%] p-6 md:p-8 lg:p-12 flex items-center">
                <div className="relative w-full h-full min-h-[320px] md:min-h-[480px] rounded-2xl overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 45vw"
                        priority={index === 1}
                    />
                </div>
            </div>
        </section>
    );
};

export default ProjectCard;
