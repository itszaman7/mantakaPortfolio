"use client";
import { useEffect, useState, useRef } from "react";

const TYPING_MS = 1;
const READ_MS = 100;
const MAX_LINES = 10;

interface AiDecisionLogProps {
    lines: string[];
    onComplete?: () => void;
}

export default function AiDecisionLog({ lines, onComplete }: AiDecisionLogProps) {
    const [completedLines, setCompletedLines] = useState<string[]>([]);
    const [lineIndex, setLineIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    const typingRef = useRef<NodeJS.Timeout | null>(null);
    const readRef = useRef<NodeJS.Timeout | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const show = lines?.slice(0, MAX_LINES) ?? [];

    useEffect(() => {
        const el = scrollRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [completedLines, displayedText]);

    useEffect(() => {
        if (show.length === 0) {
            setCompletedLines([]);
            setLineIndex(0);
            setDisplayedText("");
            return;
        }

        setCompletedLines([]);
        setLineIndex(0);
        setDisplayedText("");

        let lineIdx = 0;
        let charIdx = 0;

        const typeNext = () => {
            if (lineIdx >= show.length) return;

            const line = show[lineIdx];
            if (charIdx < line.length) {
                setDisplayedText(line.substring(0, charIdx + 1));
                charIdx++;
                typingRef.current = setTimeout(typeNext, TYPING_MS);
            } else {
                readRef.current = setTimeout(() => {
                    setCompletedLines((prev) => [...prev, line]);
                    lineIdx++;
                    charIdx = 0;
                    if (lineIdx < show.length) {
                        setLineIndex(lineIdx);
                        setDisplayedText("");
                        typingRef.current = setTimeout(typeNext, 80);
                    } else {
                        onComplete?.();
                    }
                }, READ_MS);
            }
        };

        typingRef.current = setTimeout(typeNext, 120);

        return () => {
            if (typingRef.current) clearTimeout(typingRef.current);
            if (readRef.current) clearTimeout(readRef.current);
        };
    }, [lines]);

    if (show.length === 0) return null;

    const currentFullLine = show[Math.min(lineIndex, show.length - 1)];

    return (
        <div
            ref={scrollRef}
            className="w-full h-full flex flex-col overflow-y-auto overflow-x-hidden gap-0.5 text-[clamp(10px,1.4vw,18px)] leading-tight min-w-0 pb-3"
        >
            <div className="font-mono text-red-500/90 flex flex-col min-w-0 flex-1">
                {completedLines.map((line, i) => (
                    <div key={i} className="break-words min-w-0">
                        <span className="opacity-50 mr-1.5 select-none">›</span>
                        {line}
                    </div>
                ))}
                <div className="break-words min-w-0 flex-shrink-0">
                    <span className="opacity-50 mr-1.5 select-none">›</span>
                    {displayedText}
                    {displayedText.length < currentFullLine.length && (
                        <span className="inline-block w-1.5 h-3 ml-0.5 bg-red-500/60 animate-pulse align-middle" />
                    )}
                </div>
            </div>
        </div>
    );
}
