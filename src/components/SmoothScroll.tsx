"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { ReactNode, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProps {
    children: ReactNode;
}

function LenisScrollTriggerSync() {
    const lenis = useLenis();
    useEffect(() => {
        if (!lenis) return;
        lenis.on("scroll", ScrollTrigger.update);
        const refresh = () => ScrollTrigger.refresh();
        const t = setTimeout(refresh, 150);
        return () => {
            clearTimeout(t);
            lenis.off("scroll", ScrollTrigger.update);
        };
    }, [lenis]);
    return null;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
    return (
        <ReactLenis root options={{ lerp: 0.15, duration: 0.9, smoothWheel: true }}>
            <LenisScrollTriggerSync />
            {children}
        </ReactLenis>
    );
}
