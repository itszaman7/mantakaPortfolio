"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import TicTacToe from "./TicTacToe";

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
    const [screenPowered, setScreenPowered] = useState(true); // Screen power state

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

    const getBestMove = (currentBoard: Board): number => {
        const available = currentBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
        return available.length > 0 ? available[Math.floor(Math.random() * available.length)] as number : -1;
    };

    const handleSquareClick = (index: number) => {
        if (!gameActive || board[index] || winner || !isPlayerTurn) return;
        const newBoard = [...board];
        newBoard[index] = "X";
        setBoard(newBoard);

        const result = checkWinner(newBoard);
        if (result.winner) {
            setWinner(result.winner as Player | "draw");
            setWinningLine(result.line);
        } else {
            setIsPlayerTurn(false);
        }
    };

    useEffect(() => {
        if (!isPlayerTurn && !winner && gameActive) {
            const timer = setTimeout(() => {
                const bestMove = getBestMove(board);
                if (bestMove !== -1) {
                    const newBoard = [...board];
                    newBoard[bestMove] = "O";
                    setBoard(newBoard);
                    const result = checkWinner(newBoard);
                    if (result.winner) {
                        setWinner(result.winner as Player | "draw");
                        setWinningLine(result.line);
                    } else {
                        setIsPlayerTurn(true);
                    }
                }
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isPlayerTurn, winner, board, gameActive]);

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsPlayerTurn(true);
        setWinner(null);
        setWinningLine(null);
        setGameActive(true);
    };

    const togglePower = () => {
        setScreenPowered(!screenPowered);
        if (!screenPowered) {
            // When turning on, also reset the game
            resetGame();
        }
    };

    // --- RENDER ---
    return (
        <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[#f4f4f5]">

            {/* 1. BACKGROUND TEXT */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-0 select-none pointer-events-none">
                <div className="flex flex-col leading-[0.85] text-center">
                    <span className="text-[18vw] font-bold tracking-tighter text-[#1a1a1a]">ZAMAN</span>
                    <span className="text-[18vw] font-bold tracking-tighter text-[#1a1a1a]">MANTAKA</span>
                </div>
            </div>

            {/* 2. MONITOR WRAPPER */}
            <div className="relative w-full max-w-[900px] aspect-[4/3] z-10 drop-shadow-2xl">

                <Image
                    src="/2D_Assets/crt_mockup.png"
                    alt="Vintage CRT Monitor"
                    fill
                    className="object-contain z-0"
                    priority
                />

                {/* 3. SCREEN OVERLAY */}
                <div
                    className="absolute z-10 overflow-hidden rounded-md transition-all duration-500"
                    style={{
                        top: '26%',
                        left: '34%',
                        width: '33%',
                        height: '36%',
                        backgroundColor: screenPowered ? 'transparent' : '#000',
                    }}
                >
                    {screenPowered ? (
                        <>
                            <TicTacToe
                                board={board}
                                onSquareClick={handleSquareClick}
                                winningLine={winningLine}
                                winner={winner}
                                isPlayerTurn={isPlayerTurn}
                                gameActive={gameActive}
                            />
                            <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.9)] pointer-events-none z-20"></div>
                        </>
                    ) : (
                        // Screen off - black with subtle reflection
                        <div className="w-full h-full bg-black relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                        </div>
                    )}
                </div>

                {/* 4. PHYSICAL BUTTON HOTSPOTS */}

                {/* POWER BUTTON (Big button on Left) - Enhanced Flicker */}
                <button
                    onClick={togglePower}
                    className="absolute z-20 rounded-full cursor-pointer group focus:outline-none aspect-square flex items-center justify-center"
                    style={{
                        top: '66.8%',
                        left: '39.6%',
                        width: '3.5%',
                    }}
                >
                    {/* IDLE STATE: Multi-color Flickering Circle */}
                    <div
                        className="absolute inset-0 rounded-full border-2 group-hover:opacity-0 transition-opacity duration-300"
                        style={{
                            borderColor: screenPowered ? '#22c55e' : '#ef4444',
                            backgroundColor: screenPowered ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.1)',
                            boxShadow: screenPowered
                                ? '0 0 10px rgba(34, 197, 94, 0.5), 0 0 20px rgba(34, 197, 94, 0.3), inset 0 0 10px rgba(34, 197, 94, 0.2)'
                                : '0 0 8px rgba(239, 68, 68, 0.4), 0 0 15px rgba(239, 68, 68, 0.2)',
                            animation: screenPowered
                                ? 'powerFlicker 2s ease-in-out infinite'
                                : 'powerFlickerOff 1.5s ease-in-out infinite',
                        }}
                    ></div>

                    {/* HOVER STATE: Text Label */}
                    <span className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs font-mono font-bold bg-white/95 px-2 py-1 rounded whitespace-nowrap transition-all duration-300 pointer-events-none border shadow-lg"
                        style={{
                            color: screenPowered ? '#16a34a' : '#dc2626',
                            borderColor: screenPowered ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        }}
                    >
                        {screenPowered ? 'POWER OFF' : 'POWER ON'}
                    </span>
                </button>

                {/* RESET BUTTON (Small button on Right) */}
                <button
                    onClick={resetGame}
                    className="absolute z-20 rounded-full cursor-pointer group focus:outline-none aspect-square flex items-center justify-center"
                    style={{
                        top: '67.3%',
                        left: '59.3%',
                        width: '2.5%',
                    }}
                >
                    {/* IDLE STATE: Pulsing Circle */}
                    <div className="absolute inset-0 rounded-full border-2 border-cyan-400/60 bg-cyan-400/10 animate-pulse group-hover:opacity-0 transition-opacity duration-300"
                        style={{
                            boxShadow: '0 0 8px rgba(34, 211, 238, 0.4), inset 0 0 5px rgba(34, 211, 238, 0.2)',
                        }}
                    ></div>

                    {/* HOVER STATE: Text Label */}
                    <span className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs font-mono font-bold text-[#0891b2] bg-white/95 px-2 py-1 rounded whitespace-nowrap transition-all duration-300 pointer-events-none border border-cyan-400/20 shadow-lg">
                        RESET
                    </span>
                </button>

            </div>

            {/* CSS Animations for Power Button Flicker */}
            <style jsx>{`
                @keyframes powerFlicker {
                    0%, 100% {
                        opacity: 1;
                        box-shadow: 0 0 10px rgba(34, 197, 94, 0.6), 0 0 20px rgba(34, 197, 94, 0.4), inset 0 0 10px rgba(34, 197, 94, 0.3);
                    }
                    25% {
                        opacity: 0.85;
                        box-shadow: 0 0 15px rgba(34, 197, 94, 0.8), 0 0 30px rgba(34, 197, 94, 0.5), inset 0 0 15px rgba(34, 197, 94, 0.4);
                    }
                    50% {
                        opacity: 1;
                        box-shadow: 0 0 20px rgba(74, 222, 128, 0.9), 0 0 40px rgba(74, 222, 128, 0.6), inset 0 0 20px rgba(74, 222, 128, 0.5);
                    }
                    75% {
                        opacity: 0.9;
                        box-shadow: 0 0 12px rgba(34, 197, 94, 0.7), 0 0 25px rgba(34, 197, 94, 0.45), inset 0 0 12px rgba(34, 197, 94, 0.35);
                    }
                }

                @keyframes powerFlickerOff {
                    0%, 100% {
                        opacity: 0.6;
                        box-shadow: 0 0 5px rgba(239, 68, 68, 0.3), 0 0 10px rgba(239, 68, 68, 0.2);
                    }
                    50% {
                        opacity: 0.8;
                        box-shadow: 0 0 8px rgba(239, 68, 68, 0.5), 0 0 15px rgba(239, 68, 68, 0.3);
                    }
                }
            `}</style>
        </div>
    );
}