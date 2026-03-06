"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

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
    const [menuItems, setMenuItems] = useState<any[]>([
        { label: "Home", url: "/" },
        { label: "Work", url: "/work" },
        { label: "About", url: "/about" },
        { label: "Contact", url: "/contact" },
    ]);
    const [logoType, setLogoType] = useState<'text' | 'image'>('text');
    const [logoText, setLogoText] = useState('Mantaka');
    const [logoUrl, setLogoUrl] = useState('');
    const [contactData, setContactData] = useState({
        email: "hello@mantaka.dev",
        location: "Dhaka, Bangladesh",
        socials: [
            { name: "GitHub", url: "#" },
            { name: "LinkedIn", url: "#" },
            { name: "Twitter", url: "#" }
        ]
    });

    useEffect(() => {
        const fetchData = async () => {
            const [layoutRes, contactRes] = await Promise.all([
                supabase.from('layout_settings').select('*').limit(1).single(),
                supabase.from('contact_settings').select('*').limit(1).single()
            ]);
            if (layoutRes.data) {
                setLogoType(layoutRes.data.logo_type || 'text');
                setLogoText(layoutRes.data.logo_text || 'Mantaka');
                setLogoUrl(layoutRes.data.logo_image_url || '');
                if (Array.isArray(layoutRes.data.header_links)) {
                    setMenuItems(layoutRes.data.header_links);
                }
            }
            if (contactRes.data) {
                setContactData({
                    email: contactRes.data.email || "hello@mantaka.dev",
                    location: contactRes.data.location || "Dhaka, Bangladesh",
                    socials: Array.isArray(contactRes.data.social_links) ? contactRes.data.social_links : contactData.socials
                });
            }
        };
        fetchData();
    }, []);

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
                <div className="w-full px-4 md:px-6 lg:px-6 py-4 md:py-6 flex items-start justify-between">
                    {/* Logo */}
                    <motion.a
                        href="/"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="group flex flex-col items-start relative z-10"
                    >
                        {logoType === 'image' && logoUrl ? (
                            <img src={logoUrl} alt={logoText} className="h-8 md:h-10 w-auto transition-transform hover:scale-105" />
                        ) : (
                            <span className="font-sans text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tighter text-foreground group-hover:text-red-500 transition-colors duration-300 leading-[0.85] flex flex-col">
                                {logoText.split(' ').map((word, i) => (
                                    <span key={i} className="block">{word}</span>
                                ))}
                            </span>
                        )}
                    </motion.a>


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

            {/* Full Screen Menu — rendered via portal to avoid React 19 DOM conflicts */}
            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence mode="wait">
                    {isOpen && (
                        <motion.div
                            key="fullscreen-menu"
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
                                                        href={item.url || item.href}
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
                                                                    className={`font-mono text-sm md:text-base text-pulse/60 group-hover:text-background transition-colors duration-300 font-mono`}
                                                                >
                                                                    {String(index + 1).padStart(2, "0")}
                                                                </span>

                                                                {/* Letter-by-letter animation */}
                                                                <div className="relative flex-1">
                                                                    <h2 className={`font-sans text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-foreground`}>
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
                                            <p className={`font-mono text-xs text-pulse/60 mb-3 tracking-wider`}>EMAIL</p>
                                            <a
                                                href={`mailto:${contactData.email}`}
                                                className={`font-mono text-sm text-foreground hover:text-pulse transition-colors duration-300 block`}
                                            >
                                                {contactData.email}
                                            </a>
                                        </div>

                                        {/* Social Links */}
                                        <div>
                                            <p className={`font-mono text-xs text-pulse/60 mb-4 tracking-wider`}>SOCIAL</p>
                                            <div className="flex gap-4 flex-wrap">
                                                {contactData.socials.map((social: any) => (
                                                    <a
                                                        key={social.name}
                                                        href={social.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="h-10 px-4 rounded-lg border border-foreground/20 flex items-center justify-center transition-all duration-300 group relative overflow-hidden"
                                                        aria-label={social.name}
                                                    >
                                                        <div className="absolute inset-0 bg-pulse scale-0 group-hover:scale-100 transition-transform duration-300 ease-in-out rounded-lg" />
                                                        <span className="text-xs font-bold uppercase tracking-wider text-foreground group-hover:text-background transition-colors relative z-10">
                                                            {social.name}
                                                        </span>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Location */}
                                        <div>
                                            <p className={`font-mono text-xs text-pulse/60 mb-3 tracking-wider`}>LOCATION</p>
                                            <p className={`font-mono text-sm text-foreground whitespace-pre-line`}>{contactData.location}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}
