"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function KiteTransition() {
    const kiteRef = useRef<HTMLDivElement>(null);

    // GSAP ScrollTrigger Animation for 2D Kite Image
    useGSAP(() => {
        if (!kiteRef.current) return;

        // Set initial position explicitly (bottom-left, off-screen)
        gsap.set(kiteRef.current, {
            x: "-60vw",
            y: "60vh",
            scale: 0.2,
            rotation: -20,
            opacity: 1,
        });

        // Create timeline
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#kite-scroll-track",
                start: "top top",
                end: "80% bottom",
                scrub: 1.5,
                invalidateOnRefresh: true,
            },
        });

        // 0–40%: Fly from bottom-left to center and grow
        tl.to(kiteRef.current, {
            x: "0vw",
            y: "0vh",
            scale: 1.2,
            rotation: 5,
            duration: 0.4,
            ease: "power2.out",
        })
        // 40–70%: Scale up to fill screen
        .to(kiteRef.current, {
            scale: 12,
            rotation: 0,
            duration: 0.3,
            ease: "power2.in",
        })
        // 70–100%: Fade out so Introduction section is visible
        .to(kiteRef.current, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
        });

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    return (
        <div
            ref={kiteRef}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none will-change-transform"
            style={{
                width: "400px",
                height: "400px",
            }}
        >
            <Image
                src="/2D_Assets/Kite_Colorful.png"
                alt="Kite"
                fill
                className="object-contain"
                priority
            />
        </div>
    );
}
