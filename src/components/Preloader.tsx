"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function Preloader() {
    const [loadingComplete, setLoadingComplete] = useState(false);
    const [progress, setProgress] = useState(0);
    const [milestones, setMilestones] = useState<string[]>([]);

    useEffect(() => {
        const fetchMilestones = async () => {
            const { data } = await supabase.from('milestones').select('image_url');
            if (data) {
                const urls = data.map((m: any) => m.image_url).filter(Boolean);
                // Duplicate for infinite scroll if there are images
                setMilestones(urls.length > 0 ? [...urls, ...urls, ...urls, ...urls] : []);
            }
        };
        fetchMilestones();

        document.body.style.overflow = "hidden";

        let startTimestamp: number | null = null;
        const duration = 2500; // 2.5 seconds loading simulation

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const elapsed = timestamp - startTimestamp;
            const progressValue = Math.min((elapsed / duration) * 100, 100);

            setProgress(Math.floor(progressValue));

            if (progressValue < 100) {
                window.requestAnimationFrame(step);
            } else {
                setTimeout(() => setLoadingComplete(true), 800); // 800ms buffer before exit
            }
        };

        window.requestAnimationFrame(step);

        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const containerVariants = {
        initial: { y: 0 },
        exit: {
            y: "-100%",
            transition: {
                duration: 1.2,
                ease: [0.76, 0, 0.24, 1] as any, // Custom awwwards ease
            }
        }
    };

    return (
        <AnimatePresence>
            {!loadingComplete && (
                <motion.div
                    variants={containerVariants}
                    initial="initial"
                    exit="exit"
                    className="fixed inset-0 z-[9999] bg-[#ffffff] flex flex-col items-center justify-center pointer-events-none overflow-hidden"
                >
                    {/* Scrolling Milestone Images Background */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.08 }} // Very subtle opacity for the background
                        transition={{ duration: 1 }}
                        className="absolute inset-0 flex items-center h-[50vh] overflow-hidden rotate-[-5deg] scale-150 pointer-events-none"
                    >
                        {milestones.length > 0 && (
                            <motion.div
                                animate={{ x: ["0%", "-50%"] }}
                                transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
                                className="flex gap-4 whitespace-nowrap will-change-transform"
                            >
                                {milestones.map((url, i) => (
                                    <div key={i} className="relative w-64 h-48 md:w-96 md:h-64 flex-shrink-0 blur-[2px] rounded-xl overflow-hidden saturate-0">
                                        <img src={url} alt="Milestone" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Logo and Progress */}
                    <div className="relative flex flex-col items-center w-full max-w-[200px] md:max-w-[400px]">
                        {/* New Logo SVG with Fill Animation */}
                        <svg
                            width="100%"
                            height="100%"
                            viewBox="0 0 665 242"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-full h-auto drop-shadow-sm mb-12"
                            style={{ fillRule: "evenodd", clipRule: "evenodd", strokeLinejoin: "round", strokeMiterlimit: 2 }}
                        >
                            <defs>
                                <clipPath id="fillClip">
                                    <motion.rect
                                        initial={{ y: 242, height: 0 }}
                                        animate={{
                                            y: 242 - (progress / 100) * 242,
                                            height: (progress / 100) * 242
                                        }}
                                        transition={{ ease: "linear", duration: 0.1 }}
                                        x="0"
                                        width="665"
                                    />
                                </clipPath>
                            </defs>

                            {/* Base Layer (Faint) */}
                            <g fill="#000000" opacity="0.05">
                                <path d="M0,108.285l0,-108.285l87.768,0l-87.768,108.285Zm163.047,-108.285l76.953,0l0,48.982l-155.945,192.4l-84.055,0l0,-40.219l163.047,-201.162Zm76.953,141.859l0,99.522l-80.665,0l80.665,-99.522Z" />
                                <path d="M278.265,163.139l0,-163.139l97.754,0l-97.754,163.139Zm155.776,-163.139l80.07,0l-80.43,140.268l0,-139.667l0.36,-0.601Zm106.399,54.271l0,187.111l-106.76,0l0,-0.924l106.76,-186.187Zm-156.489,187.111l-94.547,0l94.547,-157.787l0,157.787Z" />
                                <rect x="593.999" y="0" width="70.204" height="241.381" />
                            </g>

                            {/* Filled Layer (Red Theme) */}
                            <g fill="#ff002b" clipPath="url(#fillClip)">
                                <path d="M0,108.285l0,-108.285l87.768,0l-87.768,108.285Zm163.047,-108.285l76.953,0l0,48.982l-155.945,192.4l-84.055,0l0,-40.219l163.047,-201.162Zm76.953,141.859l0,99.522l-80.665,0l80.665,-99.522Z" />
                                <path d="M278.265,163.139l0,-163.139l97.754,0l-97.754,163.139Zm155.776,-163.139l80.07,0l-80.43,140.268l0,-139.667l0.36,-0.601Zm106.399,54.271l0,187.111l-106.76,0l0,-0.924l106.76,-186.187Zm-156.489,187.111l-94.547,0l94.547,-157.787l0,157.787Z" />
                                <rect x="593.999" y="0" width="70.204" height="241.381" />
                            </g>
                        </svg>

                        {/* Elegant Loading Progress */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="w-full mt-10 md:mt-12 flex flex-col items-center justify-center relative z-10"
                        >
                            <span className="text-[10px] md:text-xs font-bold tracking-[0.5em] uppercase text-[#000000]/40 mb-2 font-sans">Loading</span>
                            <div className="flex items-baseline">
                                <span className="text-5xl md:text-6xl font-black tracking-tighter text-[#ff002b]" style={{ fontFamily: "var(--font-playfair)", fontVariantNumeric: "tabular-nums" }}>
                                    {progress}
                                </span>
                                <span className="text-xl md:text-2xl font-bold text-[#ff002b]/40 ml-1 font-sans">%</span>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
