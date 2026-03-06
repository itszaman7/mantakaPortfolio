'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    const [isTouch, setIsTouch] = useState(false);

    useEffect(() => {
        setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }, []);

    // Disable on contact page, admin panel, and touch devices
    const isDisabled = pathname === '/contact' || pathname.startsWith('/admin') || pathname.startsWith('/blog/') || isTouch;

    useEffect(() => {
        if (isDisabled) {
            document.documentElement.style.cursor = '';
            return;
        }

        const cursor = cursorRef.current;
        if (!cursor) return;

        // Hide default cursor
        document.documentElement.style.cursor = 'none';

        // Mouse position tracking
        const mouse = { x: 0, y: 0 };

        const onMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;

            // Smooth but responsive snapping
            gsap.to(cursor, {
                x: mouse.x,
                y: mouse.y,
                duration: 0.4, // Longer duration for a more "dragging" liquid feel
                ease: 'power3.out',
                overwrite: 'auto',
            });
        };

        // Hover states
        const onEnterInteractive = () => {
            gsap.to(cursor, {
                width: 90,
                height: 90,
                duration: 0.6,
                ease: 'elastic.out(1, 0.4)', // Very bouncy and satisfying expansion
            });
        };

        const onLeaveInteractive = () => {
            gsap.to(cursor, {
                width: 20,
                height: 20,
                duration: 0.4,
                ease: 'power3.out',
            });
        };

        // Mouse enter/leave page
        const onMouseEnter = () => {
            gsap.to(cursor, { opacity: 1, duration: 0.3 });
        };
        const onMouseLeave = () => {
            gsap.to(cursor, { opacity: 0, duration: 0.3 });
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseenter', onMouseEnter);
        document.addEventListener('mouseleave', onMouseLeave);

        // Attach hover listeners to interactive elements
        const attachListeners = () => {
            const interactives = document.querySelectorAll(
                'a, button, [role="button"], input, textarea, select, .cursor-hover'
            );
            interactives.forEach((el) => {
                el.addEventListener('mouseenter', onEnterInteractive);
                el.addEventListener('mouseleave', onLeaveInteractive);
            });
            return interactives;
        };

        // Initial attach + observe for dynamic elements
        let interactives = attachListeners();
        const observer = new MutationObserver(() => {
            interactives.forEach((el) => {
                el.removeEventListener('mouseenter', onEnterInteractive);
                el.removeEventListener('mouseleave', onLeaveInteractive);
            });
            interactives = attachListeners();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // Ensure default state
        onLeaveInteractive();

        return () => {
            document.documentElement.style.cursor = '';
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseenter', onMouseEnter);
            document.removeEventListener('mouseleave', onMouseLeave);
            observer.disconnect();
            interactives.forEach((el) => {
                el.removeEventListener('mouseenter', onEnterInteractive);
                el.removeEventListener('mouseleave', onLeaveInteractive);
            });
        };
    }, [isDisabled]);

    if (isDisabled) return null;

    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 z-[9999] pointer-events-none flex items-center justify-center mix-blend-difference"
            style={{
                width: 20,
                height: 20,
                backgroundColor: '#ffffff', // Pure white with difference blend mode creates the perfect inversion
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                boxSizing: 'border-box',
                willChange: 'width, height, transform',
            }}
        />
    );
}
