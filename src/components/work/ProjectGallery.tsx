"use client";
import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectCard from "./ProjectCard";
import { projects, Project } from "./projectsData"; // Updated import

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// Separate component for Row Logic to manage state cleanly
const ProjectRow = ({ projectsPair, rowIndex }: { projectsPair: Project[], rowIndex: number }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div className="project-row flex flex-col md:flex-row w-full h-[60vh] md:h-[55vh] gap-1">
            {projectsPair.map((project, index) => {
                // Determine flex basis class
                // Default: flex-1
                // Hovered: flex-[2.5]
                // Others (when one is hovered): flex-[0.5]

                let flexClass = "flex-1";
                if (hoveredIndex !== null) {
                    if (hoveredIndex === index) {
                        flexClass = "flex-[1.5]";
                    } else {
                        flexClass = "flex-[0.75]";
                    }
                }

                return (
                    <div
                        key={project.id}
                        className={`relative h-full transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden cursor-pointer ${flexClass}`}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <ProjectCard project={project} />
                    </div>
                )
            })}
        </div>
    );
};

const ProjectGallery = () => {
    const containerRef = useRef(null);

    useGSAP(() => {
        // Animate Rows on Scroll
        const rows = gsap.utils.toArray(".project-row", containerRef.current);

        rows.forEach((row: any, i) => {
            gsap.fromTo(row,
                { y: 100, opacity: 0, scale: 0.95 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: row,
                        start: "top 85%", // Trigger when row top hits 85% of viewport
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

    }, { scope: containerRef });

    // Chunk projects into pairs
    const chunkedProjects = [];
    for (let i = 0; i < projects.length; i += 2) {
        chunkedProjects.push(projects.slice(i, i + 2));
    }

    return (
        <section
            ref={containerRef}
            className="w-full bg-[#f4f4f5] pb-24 pt-12 flex flex-col gap-1 min-h-screen"
        >
            <div className="project-row opacity-0 translate-y-10 px-4 md:px-12 lg:px-24 mb-0"> {/* Initial hidden state for animation */}
                <h2 className="font-space-grotesk font-black tracking-tighter text-gray-900 text-[11.5vw] leading-[0.8] mb-[-1vw]">
                    SELECTED WORK
                </h2>
            </div>

            <div className="flex flex-col gap-1 w-full px-1">
                {chunkedProjects.map((pair, i) => (
                    <ProjectRow key={i} rowIndex={i} projectsPair={pair} />
                ))}
            </div>
        </section>
    );
};

export default ProjectGallery;
