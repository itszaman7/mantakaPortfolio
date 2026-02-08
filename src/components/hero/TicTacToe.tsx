"use client";

type Player = "X" | "O" | null;

interface TicTacToeProps {
    board: Player[];
    onSquareClick: (index: number) => void;
    winningLine: number[] | null;
    winner: Player | "draw" | null;
    isPlayerTurn: boolean;
    gameActive: boolean;
}

export default function TicTacToe({
    board,
    onSquareClick,
    winningLine,
    winner,
    isPlayerTurn,
    gameActive,
}: TicTacToeProps) {
    return (
        <div className="relative w-full h-full bg-black flex flex-col items-center justify-center p-2">
            {/* Status Bar - Compact */}
            <div className="absolute top-1 left-0 right-0 text-center">
                <p
                    className="font-mono text-[8px] sm:text-[10px] tracking-wider uppercase"
                    style={{
                        color: '#ff0040',
                        textShadow: '0 0 4px #ff0040',
                    }}
                >
                    {!gameActive ? (
                        "STOPPED"
                    ) : winner ? (
                        winner === "draw" ? "DRAW" : `${winner} WINS`
                    ) : (
                        isPlayerTurn ? "YOUR TURN" : "CPU..."
                    )}
                </p>
            </div>

            {/* Game Grid - Fills remaining space */}
            <div className="w-full h-full flex items-center justify-center px-1 pb-1 pt-4">
                <div className="grid grid-cols-3 grid-rows-3 gap-[2px] w-full h-full max-w-full max-h-full aspect-square">
                    {board.map((cell, index) => {
                        const isWinningCell = winningLine?.includes(index);
                        return (
                            <button
                                key={index}
                                onClick={() => onSquareClick(index)}
                                disabled={!!cell || !!winner || !isPlayerTurn || !gameActive}
                                className="relative flex items-center justify-center font-mono font-bold text-[clamp(1rem,4vw,2rem)] transition-all duration-150 disabled:cursor-not-allowed hover:enabled:bg-red-900/20 border border-red-600/30"
                                style={{
                                    backgroundColor: isWinningCell ? 'rgba(255, 0, 64, 0.25)' : 'rgba(0, 0, 0, 0.8)',
                                    color: cell === "X" ? '#ff0040' : '#ff6b9d',
                                    textShadow: cell ? `0 0 6px currentColor, 0 0 10px currentColor` : 'none',
                                }}
                            >
                                {cell}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
