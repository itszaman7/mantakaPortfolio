"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import TicTacToe from "./TicTacToe";
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
        if (!el || window.innerWidth < 768) return; // Disable on mobile

        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth - 0.5) * -18;
            const y = (e.clientY / window.innerHeight - 0.5) * -18;
            gsap.to(el, { x, y, duration: 1.2, ease: "power2.out", overwrite: "auto" });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
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
        // MAIN CONTAINER: Flex Column on Mobile, Row on Desktop
        <div className="relative w-full min-h-screen flex flex-col md:flex-row items-center justify-center md:justify-between overflow-hidden bg-[#f4f4f5] px-4 md:px-12 py-12 md:py-0">

            {/* 1. TITLES SECTION */}
            <div className="flex flex-col items-center md:items-start justify-center w-full md:w-1/2 z-0 pointer-events-auto mb-8 md:mb-0">
                {/* Mobile: Tight spacing. Desktop: Normal spacing */}
                <div className="flex flex-col items-center md:items-start space-y-[-4vw] md:space-y-[-1rem]">
                    <AnimatedTitle
                        text="ZAMAN"
                        translatedText="জামান"
                        className="text-[22vw] md:text-[clamp(5rem,13vw,16rem)] text-[#1a1a1a]"
                    />
                    <AnimatedTitle
                        text="MANTAKA"
                        translatedText="মানতাকা"
                        // Removed margin-left on mobile to center it perfectly
                        className="text-[22vw] md:text-[clamp(5rem,13vw,16rem)] text-[#1a1a1a] ml-0 md:ml-6"
                    />
                </div>
            </div>

            {/* 2. MONITOR SECTION */}
            <div
                ref={monitorRef}
                // Mobile: w-full, no translate. Desktop: translate-x to push right.
                className="relative w-full max-w-[500px] md:max-w-[1000px] aspect-[4/3] z-10 drop-shadow-2xl translate-x-0 md:translate-x-12 lg:translate-x-20 pointer-events-none will-change-transform"
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
        </div>
    );
}