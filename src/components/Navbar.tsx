"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
    { label: "Home", href: "#home" },
    { label: "Projects & Awards", href: "#projects" },
    { label: "About me", href: "#about" },
    { label: "Contact", href: "#contact" },
];

// Letter-by-letter animation component
const AnimatedText = ({ text }: { text: string }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const letters = text.split("");

    const handleMouseEnter = () => {
        if (!isAnimating) {
            setIsAnimating(true);
            // Start return animation earlier - before all letters finish flipping out
            setTimeout(() => {
                setIsAnimating(false);
            }, letters.length * 30 + 200);
        }
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={handleMouseEnter}
        >
            {letters.map((letter, index) => (
                <span
                    key={index}
                    className="relative inline-block"
                    style={{
                        display: letter === " " ? "inline" : "inline-block",
                        verticalAlign: "top",
                        perspective: "1000px",
                        transformStyle: "preserve-3d"
                    }}
                >
                    <motion.span
                        animate={{
                            rotateX: isAnimating ? [0, -90, -180] : [-180, -270, -360]
                        }}
                        transition={{
                            duration: 0.35,
                            ease: "easeInOut",
                            delay: isAnimating ? index * 0.03 : index * 0.02,
                            times: [0, 0.5, 1]
                        }}
                        className="inline-block"
                        style={{
                            transformStyle: "preserve-3d",
                            backfaceVisibility: "hidden"
                        }}
                    >
                        <span
                            className="inline-block"
                            style={{
                                backfaceVisibility: "hidden",
                            }}
                        >
                            {letter === " " ? "\u00A0" : letter}
                        </span>
                        <span
                            className="absolute left-0 top-0 inline-block text-background"
                            style={{
                                transform: "rotateX(90deg)",
                                transformOrigin: "50% 50%",
                                backfaceVisibility: "hidden",
                                WebkitTextStroke: "2px #ef4444", // Red outline (Tailwind red-500)
                                textStroke: "2px #ef4444",
                                paintOrder: "stroke fill",
                                opacity: isAnimating ? 1 : 0
                            } as any}
                        >
                            {letter === " " ? "\u00A0" : letter}
                        </span>
                    </motion.span>
                </span>
            ))}
        </div>
    );
};

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="fixed top-0 left-0 right-0 z-50 bg-transparent transition-all duration-500"
            >
                <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-end">


                    {/* Hamburger Button */}
                    <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        onClick={() => setIsOpen(!isOpen)}
                        className="relative w-12 h-12 flex items-center justify-center group rounded-xl border-2 border-foreground/20 overflow-hidden bg-transparent"
                        aria-label="Toggle menu"
                    >
                        {/* Background fill on hover */}
                        <div className="absolute inset-0 bg-pulse scale-0 group-hover:scale-100 transition-transform duration-300 ease-in-out" />

                        <div className="relative w-6 h-5 flex flex-col justify-between z-10">
                            <motion.span
                                animate={{
                                    rotate: isOpen ? 45 : 0,
                                    y: isOpen ? 8 : 0,
                                }}
                                transition={{ duration: 0.3 }}
                                className="w-full h-0.5 rounded-full bg-foreground group-hover:bg-background transition-colors duration-300"
                            />
                            <motion.span
                                animate={{
                                    opacity: isOpen ? 0 : 1,
                                }}
                                transition={{ duration: 0.3 }}
                                className="w-full h-0.5 rounded-full bg-foreground group-hover:bg-background transition-colors duration-300"
                            />
                            <motion.span
                                animate={{
                                    rotate: isOpen ? -45 : 0,
                                    y: isOpen ? -8 : 0,
                                }}
                                transition={{ duration: 0.3 }}
                                className="w-full h-0.5 rounded-full bg-foreground group-hover:bg-background transition-colors duration-300"
                            />
                        </div>
                    </motion.button>
                </div>
            </motion.nav>

            {/* Full Screen Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-40 bg-background/98 backdrop-blur-2xl"
                    >
                        <div className="h-full flex">
                            {/* Main Menu - Left Side */}
                            <div className="flex-1 flex items-center justify-center px-6 py-24">
                                <nav className="w-full max-w-3xl">
                                    <ul className="space-y-2">
                                        {menuItems.map((item, index) => (
                                            <motion.li
                                                key={item.label}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{
                                                    delay: index * 0.1,
                                                    duration: 0.4,
                                                }}
                                            >
                                                <a
                                                    href={item.href}
                                                    onClick={() => setIsOpen(false)}
                                                    className="group block relative overflow-hidden"
                                                >
                                                    <div className="relative py-4 md:py-6">
                                                        {/* Animated Background */}
                                                        <div
                                                            className="absolute inset-0 bg-pulse origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-400 ease-in-out"
                                                        />

                                                        {/* Number and Text */}
                                                        <div className="relative flex items-baseline gap-6 md:gap-12">
                                                            <span
                                                                className={`font-jetbrains-mono text-sm md:text-base text-pulse/60 group-hover:text-background transition-colors duration-300 font-mono`}
                                                            >
                                                                {String(index + 1).padStart(2, "0")}
                                                            </span>

                                                            {/* Letter-by-letter animation */}
                                                            <div className="relative flex-1">
                                                                <h2 className={`font-space-grotesk text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-foreground`}>
                                                                    <AnimatedText text={item.label} />
                                                                </h2>
                                                            </div>

                                                            {/* Arrow */}
                                                            <motion.div
                                                                className="hidden md:block"
                                                                initial={{ x: -10, opacity: 0 }}
                                                                whileHover={{ x: 0, opacity: 1 }}
                                                                transition={{ duration: 0.3 }}
                                                            >
                                                                <svg
                                                                    className="w-8 h-8 text-background group-hover:text-background"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                                                                    />
                                                                </svg>
                                                            </motion.div>
                                                        </div>
                                                    </div>
                                                </a>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </nav>
                            </div>

                            {/* Contact Sidebar - Right Side */}
                            <motion.div
                                initial={{ x: 100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 100, opacity: 0 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                                className="hidden lg:flex w-80 border-l border-foreground/10 bg-canvas-depth/50"
                            >
                                <div className="flex flex-col justify-between p-12 w-full">
                                    {/* Email */}
                                    <div>
                                        <p className={`font-jetbrains-mono text-xs text-pulse/60 mb-3 tracking-wider`}>EMAIL</p>
                                        <a
                                            href="mailto:hello@mantaka.dev"
                                            className={`font-jetbrains-mono text-sm text-foreground hover:text-pulse transition-colors duration-300 block`}
                                        >
                                            hello@mantaka.dev
                                        </a>
                                    </div>

                                    {/* Social Links */}
                                    <div>
                                        <p className={`font-jetbrains-mono text-xs text-pulse/60 mb-4 tracking-wider`}>SOCIAL</p>
                                        <div className="flex gap-4">
                                            {/* GitHub */}
                                            <a
                                                href="https://github.com"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-10 h-10 rounded-lg border border-foreground/20 flex items-center justify-center transition-all duration-300 group relative overflow-hidden"
                                                aria-label="GitHub"
                                            >
                                                {/* Fill Layer - Center expansion like navbar buttons */}
                                                <div className="absolute inset-0 bg-pulse scale-0 group-hover:scale-100 transition-transform duration-300 ease-in-out rounded-lg" />

                                                <svg className="w-5 h-5 text-foreground group-hover:text-background transition-colors relative z-10" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                </svg>
                                            </a>

                                            {/* LinkedIn */}
                                            <a
                                                href="https://linkedin.com"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-10 h-10 rounded-lg border border-foreground/20 flex items-center justify-center transition-all duration-300 group relative overflow-hidden"
                                                aria-label="LinkedIn"
                                            >
                                                {/* Fill Layer - Center expansion like navbar buttons */}
                                                <div className="absolute inset-0 bg-pulse scale-0 group-hover:scale-100 transition-transform duration-300 ease-in-out rounded-lg" />

                                                <svg className="w-5 h-5 text-foreground group-hover:text-background transition-colors relative z-10" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                                </svg>
                                            </a>

                                            {/* Twitter */}
                                            <a
                                                href="https://twitter.com"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-10 h-10 rounded-lg border border-foreground/20 flex items-center justify-center transition-all duration-300 group relative overflow-hidden"
                                                aria-label="Twitter"
                                            >
                                                {/* Fill Layer - Center expansion like navbar buttons */}
                                                <div className="absolute inset-0 bg-pulse scale-0 group-hover:scale-100 transition-transform duration-300 ease-in-out rounded-lg" />

                                                <svg className="w-5 h-5 text-foreground group-hover:text-background transition-colors relative z-10" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div>
                                        <p className={`font-jetbrains-mono text-xs text-pulse/60 mb-3 tracking-wider`}>LOCATION</p>
                                        <p className={`font-jetbrains-mono text-sm text-foreground`}>Dhaka, Bangladesh</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
