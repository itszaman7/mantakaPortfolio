"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectCard from "./ProjectCard";
import { projects } from "./projectsData";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const ProjectGallery = () => {
    const containerRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        const container = containerRef.current;
        if (!container) return;

        const cards = gsap.utils.toArray<HTMLElement>(".work-card", container);

        cards.forEach((card, index) => {
            if (index === cards.length - 1) return; // Don't animate the last card

            // Scale, border-radius, and rotation animation
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: card,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
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

            // Hide the card when the next one reaches the top
            if (index < cards.length - 1) {
                gsap.to(card, {
                    opacity: 0,
                    pointerEvents: "none",
                    scrollTrigger: {
                        trigger: cards[index + 1],
                        start: "top 5%",
                        end: "top top",
                        scrub: 0.5,
                    },
                });
            }
        });

        return () => {
            ScrollTrigger.getAll().forEach((st) => st.kill());
        };
    }, { scope: containerRef, dependencies: [] });

    return (
        <section ref={containerRef} className="w-full relative bg-neutral-50 overflow-hidden">
            <div className="px-6 md:px-12 lg:px-24 pt-16 pb-8">
                <h2 className="font-space-grotesk font-black tracking-tighter text-neutral-900 text-[11.5vw] leading-[0.8]">
                    SELECTED WORK
                </h2>
            </div>

            <div className="relative block">
                {projects.map((project, i) => (
                    <div
                        key={project.id}
                        className="work-card sticky top-0 h-screen w-full overflow-hidden"
                    >
                        <ProjectCard project={project} index={i + 1} />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ProjectGallery;