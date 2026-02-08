type Player = "X" | "O" | null;
type Board = Player[];

// Returns score for the board: 10 if O wins, -10 if X wins, 0 for draw
function evaluate(board: Board): number {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const [a, b, c] of lines) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a] === "O" ? 10 : -10;
        }
    }
    return 0;
}

function isMovesLeft(board: Board): boolean {
    return board.some((cell) => cell === null);
}

// Standard Minimax with Alpha-Beta Pruning could be used, but for 3x3 standard is fine.
// Using depth to prefer winning sooner or losing later.
function minimax(board: Board, depth: number, isMax: boolean): number {
    const score = evaluate(board);

    if (score === 10) return score - depth;
    if (score === -10) return score + depth;
    if (!isMovesLeft(board)) return 0;

    if (isMax) {
        let best = -1000;
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = "O";
                best = Math.max(best, minimax(board, depth + 1, false));
                board[i] = null;
            }
        }
        return best;
    } else {
        let best = 1000;
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = "X";
                best = Math.min(best, minimax(board, depth + 1, true));
                board[i] = null;
            }
        }
        return best;
    }
}

export function getBestMoveWithLogs(board: Board): { move: number, logs: string[] } {
    const logs: string[] = [];
    const emptySpots = board.filter(c => c === null).length;

    if (emptySpots === 9) {
        logs.push("def choose_move(state: Board) -> int:");
        logs.push("  # opening book: center controls diagonals");
        logs.push("  empty = [i for i in range(9) if state[i] is None]");
        logs.push("  return 4  # minimax(expand(state, 4)) -> best");
        return { move: 4, logs };
    }

    logs.push("def choose_move(state: Board) -> int:");
    logs.push("  best_val, best_move = -inf, None");

    let bestVal = -1000;
    let bestMove = -1;
    const moves: { index: number, score: number }[] = [];

    for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
            board[i] = "O";
            const moveVal = minimax(board, 0, false);
            board[i] = null;
            moves.push({ index: i, score: moveVal });
            if (moveVal > bestVal) {
                bestMove = i;
                bestVal = moveVal;
            }
        }
    }

    moves.sort((a, b) => b.score - a.score);

    logs.push("  for cell in empty_cells(state):");
    logs.push("    child = result(state, cell, O)");
    logs.push("    v = minimax(child, depth=0, maximize=False)");

    const coord = (idx: number) => `(${Math.floor(idx / 3)},${idx % 3})`;
    const outcome = (s: number) => s > 0 ? "win" : s < 0 ? "loss" : "draw";
    moves.slice(0, 4).forEach((m, i) => {
        logs.push(`  # cell=${coord(m.index)} -> ${outcome(m.score)} (score=${m.score})`);
    });

    logs.push(`  best_val, best_move = ${bestVal}, ${bestMove}`);
    logs.push(`  return best_move  # ${coord(bestMove)}`);

    return { move: bestMove, logs };
}
