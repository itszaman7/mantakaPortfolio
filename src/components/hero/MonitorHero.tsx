"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TicTacToe from "./TicTacToe";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}
import AnimatedTitle from "./AnimatedTitle";
import { getBestMoveWithLogs } from "@/utils/minimax";
import AiDecisionLog from "./AiDecisionLog";

type Player = "X" | "O" | null;
type Board = Player[];

const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
];

export default function MonitorHero() {
    // --- GAME LOGIC ---
    const [board, setBoard] = useState<Board>(Array(9).fill(null));
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [winner, setWinner] = useState<Player | "draw" | null>(null);
    const [winningLine, setWinningLine] = useState<number[] | null>(null);
    const [gameActive, setGameActive] = useState(true);
    const [screenPowered, setScreenPowered] = useState(true);
    const [screenPoweringOff, setScreenPoweringOff] = useState(false);
    const [screenJustOn, setScreenJustOn] = useState(false);
    const [aiLogs, setAiLogs] = useState<string[]>([]);
    const pendingMoveRef = useRef<number | null>(null);
    const aiTurnStartedRef = useRef(false);
    const monitorRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const titlesRef = useRef<HTMLDivElement>(null);

    const checkWinner = (currentBoard: Board) => {
        for (const combo of WINNING_COMBINATIONS) {
            const [a, b, c] = combo;
            if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
                return { winner: currentBoard[a], line: combo };
            }
        }
        if (currentBoard.every(cell => cell !== null)) return { winner: "draw", line: null };
        return { winner: null, line: null };
    };

    const handleSquareClick = (index: number) => {
        if (!gameActive || board[index] || winner || !isPlayerTurn) return;
        const newBoard = [...board];
        newBoard[index] = "X";
        setBoard(newBoard);
        setAiLogs([]);

        const result = checkWinner(newBoard);
        if (result.winner) {
            setWinner(result.winner as Player | "draw");
            setWinningLine(result.line);
            setAiLogs([]);
        } else {
            setIsPlayerTurn(false);
        }
    };

    useEffect(() => {
        if (!isPlayerTurn && !winner && gameActive && !aiTurnStartedRef.current) {
            aiTurnStartedRef.current = true;
            const { move, logs } = getBestMoveWithLogs(board);
            if (move !== -1) {
                pendingMoveRef.current = move;
                setAiLogs(logs);
            } else {
                aiTurnStartedRef.current = false;
                setIsPlayerTurn(true);
            }
        }
    }, [isPlayerTurn, winner, board, gameActive]);

    const handleThinkingComplete = () => {
        aiTurnStartedRef.current = false;
        const move = pendingMoveRef.current;
        pendingMoveRef.current = null;
        setAiLogs([]);
        if (move === null || move < 0) {
            setIsPlayerTurn(true);
            return;
        }
        const newBoard = [...board];
        newBoard[move] = "O";
        setBoard(newBoard);
        const result = checkWinner(newBoard);
        if (result.winner) {
            setWinner(result.winner as Player | "draw");
            setWinningLine(result.line);
        } else {
            setIsPlayerTurn(true);
        }
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsPlayerTurn(true);
        setWinner(null);
        setWinningLine(null);
        setGameActive(true);
        setAiLogs([]);
    };

    // Parallax Effect (Only on Desktop)
    useEffect(() => {
        const el = monitorRef.current;
        if (!el || window.innerWidth < 768) return;

        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth - 0.5) * -18;
            const y = (e.clientY / window.innerHeight - 0.5) * -18;
            gsap.to(el, { x, y, duration: 1.2, ease: "power2.out", overwrite: "auto" });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // Scroll-out: one-shot gravity fall – only after user has scrolled past hero
    useEffect(() => {
        const section = heroRef.current;
        const titles = titlesRef.current;
        if (!section || !titles) return;

        gsap.set(titles, { opacity: 1, rotateX: 0, y: 0, rotateZ: 0 });

        const fall = gsap.timeline({ paused: true });
        fall.to(titles, {
            duration: 0.8,
            ease: "back.in(1.7)", // "Cute" pop anticipation before leaving
            scale: 0.9,
            y: -100, // Float UP away
            opacity: 0,
            transformOrigin: "center center",
        });

        let st: ScrollTrigger | null = null;
        const setup = () => {
            if (st) return;
            st = ScrollTrigger.create({
                trigger: section,
                start: "top top-=25%", // Requires scrolling 25% down before triggering
                toggleActions: "play none none reverse", // Reverses on scroll up (reset)
                animation: fall,
                // once: true, // REMOVED to allow replay
            });
        };

        const t = setTimeout(() => {
            ScrollTrigger.refresh();
            setup();
        }, 500);

        return () => {
            clearTimeout(t);
            if (st) st.kill();
            fall.kill();
        };
    }, []);

    const togglePower = () => {
        if (screenPowered) {
            setAiLogs([]);
            setScreenPoweringOff(true);
            setTimeout(() => {
                setScreenPoweringOff(false);
                setScreenPowered(false);
            }, 320);
        } else {
            setScreenPowered(true);
            setScreenJustOn(true);
            resetGame();
            setTimeout(() => setScreenJustOn(false), 600);
        }
    };

    // --- RENDER ---
    return (
        <section
            ref={heroRef}
            className="relative w-full min-h-screen overflow-hidden bg-[#f4f4f5] px-4 md:px-12 py-12 md:py-0"
            style={{ perspective: "1400px" }}
        >
            {/* 1. TITLES – in-flow left; size changes don't move the monitor */}
            <div
                ref={titlesRef}
                className="relative z-0 pointer-events-auto flex flex-col items-center md:items-start justify-center min-h-screen md:min-h-0 md:h-screen w-full md:max-w-[55%] mb-8 md:mb-0 origin-center will-change-transform"
                style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
            >
                {/* Scroll Indicator (Moved to Right Side) */}
                <div className="absolute right-4 md:right-8 bottom-4 md:bottom-8 flex flex-col items-center gap-2 animate-bounce z-20">
                    <span className="text-xs uppercase tracking-widest text-gray-800 rotate-90 origin-right translate-y-8 -translate-x-1 font-bold">Scroll</span>
                    <div className="w-[2px] h-12 bg-gray-800 mt-8"></div>
                    <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[8px] border-t-gray-800"></div>
                </div>

                <div className="flex flex-col items-center md:items-start space-y-[-4vw] md:space-y-[-1rem]">
                    <AnimatedTitle
                        text="ZAMAN"
                        translatedText="জামান"
                        className="text-[22vw] md:text-[clamp(5rem,13vw,16rem)] text-[#1a1a1a]"
                    />
                    <AnimatedTitle
                        text="MANTAKA"
                        translatedText="মানতাকা"
                        // Increased ml to 32 (8rem) to indent significantly more
                        className="text-[22vw] md:text-[clamp(5rem,13vw,16rem)] text-[#1a1a1a] ml-0 md:ml-32"
                    />
                </div>
            </div>

            {/* 2. MONITOR – fixed position (right); independent of text size */}
            <div
                ref={monitorRef}
                className="absolute right-4 md:right-12 lg:right-20 top-1/2 -translate-y-1/2 w-[min(92vw,500px)] md:w-[min(55vw,1000px)] max-w-[500px] md:max-w-[1000px] aspect-[4/3] z-10 drop-shadow-2xl pointer-events-none will-change-transform"
            >

                <Image
                    src="/2D_Assets/crt_mockup.png"
                    alt="Vintage CRT Monitor"
                    fill
                    className="object-contain z-0"
                    priority
                />

                {/* 3. SCREEN OVERLAY */}
                <div
                    className="absolute z-10 overflow-hidden rounded-md pointer-events-auto transition-all duration-300"
                    style={{
                        top: '26%',
                        left: '34%',
                        width: '33%',
                        height: '36%',
                        backgroundColor: screenPowered && !screenPoweringOff ? 'transparent' : '#000',
                    }}
                >
                    {screenPowered ? (
                        <>
                            <div className={`w-full h-full bg-black transition-all duration-300 flex flex-col items-start justify-center p-[2px] md:p-2 overflow-hidden ${screenPoweringOff ? "crt-power-off" : ""} ${screenJustOn ? "crt-power-on" : ""}`}>
                                {aiLogs.length > 0 ? (
                                    <AiDecisionLog lines={aiLogs} onComplete={handleThinkingComplete} />
                                ) : (
                                    <TicTacToe
                                        board={board}
                                        onSquareClick={handleSquareClick}
                                        winningLine={winningLine}
                                        winner={winner}
                                        isPlayerTurn={isPlayerTurn}
                                        gameActive={gameActive}
                                    />
                                )}
                            </div>
                            <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.9)] pointer-events-none z-20"></div>
                        </>
                    ) : (
                        <div className="w-full h-full bg-black relative crt-off">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                        </div>
                    )}
                </div>

                {/* 4. BUTTONS */}
                <button
                    onClick={togglePower}
                    className="absolute z-20 rounded-full cursor-pointer group focus:outline-none aspect-square flex items-center justify-center pointer-events-auto"
                    style={{ top: '66.8%', left: '39.6%', width: '3.5%' }}
                >
                    <div className="absolute inset-0 rounded-full border-2 group-hover:opacity-0 transition-opacity duration-300"
                        style={{
                            borderColor: screenPowered ? '#22c55e' : '#ef4444',
                            backgroundColor: screenPowered ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.1)',
                            animation: screenPowered ? 'powerFlicker 2s ease-in-out infinite' : 'powerFlickerOff 1.5s ease-in-out infinite',
                        }}
                    ></div>
                </button>

                <button
                    onClick={resetGame}
                    className="absolute z-20 rounded-full cursor-pointer group focus:outline-none aspect-square flex items-center justify-center pointer-events-auto"
                    style={{ top: '67.3%', left: '59.3%', width: '2.5%' }}
                >
                    <div className="absolute inset-0 rounded-full border-2 border-cyan-400/60 bg-cyan-400/10 animate-pulse group-hover:opacity-0 transition-opacity duration-300"></div>
                </button>
            </div>

            <style jsx>{`
                @keyframes powerFlicker {
                    0%, 100% { opacity: 1; box-shadow: 0 0 10px rgba(34, 197, 94, 0.6); }
                    50% { opacity: 1; box-shadow: 0 0 20px rgba(74, 222, 128, 0.9); }
                }
                @keyframes powerFlickerOff {
                    0%, 100% { opacity: 0.6; box-shadow: 0 0 5px rgba(239, 68, 68, 0.3); }
                    50% { opacity: 0.8; box-shadow: 0 0 8px rgba(239, 68, 68, 0.5); }
                }
                .crt-power-off { animation: crtPowerOff 0.3s ease-in forwards; }
                @keyframes crtPowerOff {
                    0% { opacity: 1; transform: scaleY(1); }
                    100% { opacity: 0; transform: scaleY(0.02); }
                }
                .crt-power-on { animation: crtPowerOn 0.55s ease-out forwards; }
                @keyframes crtPowerOn {
                    0% { opacity: 0; transform: scaleY(0.02); }
                    100% { opacity: 1; transform: scaleY(1); }
                }
            `}</style>
        </section>
    );
}