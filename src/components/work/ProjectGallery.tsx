"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectCard from "./ProjectCard";
import { getProjects, Project } from "./projectsData";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const ProjectGallery = () => {
    const containerRef = useRef<HTMLElement>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await getProjects();
                setProjects(data);
            } catch (error) {
                console.error("Failed to fetch projects:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, []);

    useGSAP(() => {
        if (isLoading || projects.length === 0) return;

        const container = containerRef.current;
        if (!container) return;

        // Small delay to ensure DOM is fully rendered
        const timer = setTimeout(() => {
            const cards = gsap.utils.toArray<HTMLElement>(".work-card", container);
            ScrollTrigger.refresh();

            cards.forEach((card, index) => {
                if (index === cards.length - 1) return; // Don't animate the last card

                // Scale, border-radius, and rotation animation
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: card,
                        start: "top top",
                        end: "bottom top",
                        scrub: true,
                        // markers: true, // debug
                    },
                });

                tl.to(card, {
                    scale: 0.65,
                    borderRadius: "32px",
                    ease: "none",
                })
                    .fromTo(
                        card,
                        { rotation: 0 },
                        {
                            rotation: index % 2 === 0 ? 8 : -8,
                            ease: "sine.inOut",
                            duration: 0.2,
                        },
                        0
                    );

                // Image Parallax / Scale Interaction
                // Target the wrapper or image specifically
                const image = card.querySelector(".project-image-container img");
                if (image) {
                    tl.fromTo(image, { scale: 1 }, { scale: 1.15, ease: "none" }, 0);
                }

                // Hide the card when the next one reaches the top
                if (index < cards.length - 1) {
                    gsap.to(card, {
                        opacity: 0,
                        pointerEvents: "none", // Restore this to ensure hidden card doesn't block interactions
                        scrollTrigger: {
                            trigger: cards[index + 1],
                            start: "top 5%", // Start fading out slightly before overlap
                            end: "top top",
                            scrub: 0.5,
                        },
                    });
                }
            });
        }, 100);

        return () => {
            clearTimeout(timer);
            ScrollTrigger.getAll().forEach((st) => st.kill());
        };
    }, { scope: containerRef, dependencies: [isLoading, projects.length] });

    if (isLoading) {
        return (
            <section className="w-full h-screen flex items-center justify-center bg-neutral-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-sans font-medium text-neutral-500">Loading works...</p>
                </div>
            </section>
        );
    }

    if (projects.length === 0) {
        return (
            <section className="w-full py-32 flex items-center justify-center bg-neutral-50">
                <div className="text-center px-6">
                    <h2 className="font-sans font-bold text-3xl mb-4 text-neutral-900">No projects found</h2>
                    <p className="text-neutral-500 max-w-md mx-auto">
                        Check back later or ensure your database has entries.
                    </p>
                </div>
            </section>
        );
    }


    return (
        <section ref={containerRef} className="w-full relative bg-neutral-50">
            <div className="px-6 md:px-12 lg:px-24 pt-16 pb-8">
                <h2 className="font-sans font-black tracking-tighter text-neutral-900 text-[11.5vw] leading-[0.8]">
                    SELECTED WORK
                </h2>
            </div>

            <div className="relative">
                {projects.map((project, i) => (
                    <div
                        key={project.id}
                        className="work-card sticky top-0 h-screen w-full overflow-hidden"
                        style={{ zIndex: i + 1 }}
                    >
                        <ProjectCard project={project} index={i + 1} />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ProjectGallery;