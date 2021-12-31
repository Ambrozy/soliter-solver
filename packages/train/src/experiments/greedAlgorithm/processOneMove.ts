import type { Board, Move } from '../../game';
import { getBoardReward, getBoardScore, nextState, possibleMoves } from '../../game';
import { force } from '../../utils';
import { ProcessOneMoveType } from '../common/types';
import { getNoMovesReturn } from '../common';

type TreeNode = {
    board: Board;
    moves: Move[];
    depth: number;
    score: number;
    history: Move[];
};

const getScore = (
    board: Board,
    moves: Move[],
    searchDepth: number,
    stepsLimit: number,
) => {
    const tree: TreeNode[] = [{ board, moves, depth: 0, score: 0, history: [] }];

    let depth = 0;
    let steps = 0;
    const isWhile = () => depth < searchDepth && steps < stepsLimit;
    while (isWhile()) {
        const step = tree.shift();
        depth = step.depth;
        steps += 1;

        if (isWhile()) {
            const nextSteps = moves.map((move) => {
                const nextBoard = nextState(board, move);
                const nextScore = getBoardScore(nextBoard);
                const nextMoves = possibleMoves(nextBoard);
                const nextDepth = step.depth + 1;
                const nextHistory = [...step.history, move];

                return {
                    board: nextBoard,
                    moves: nextMoves,
                    depth: nextDepth,
                    score: nextScore,
                    history: nextHistory,
                };
            });

            tree.push(...nextSteps);
        }
    }

    const scores = tree.map((item) => item.score);
    const index = force(scores);

    return tree[index];
};

export const processOneMove: ProcessOneMoveType = (_, __, board) => {
    const moves = possibleMoves(board);
    const noMovesReturn = getNoMovesReturn(board);

    if (moves.length) {
        const bestNode = getScore(board, moves, 4, 1500);

        if (!bestNode) {
            return noMovesReturn;
        }

        const score = bestNode.score;
        const bestMove = bestNode.history[0];
        const nextBoard = nextState(board, bestMove);
        const reward = getBoardReward(board, nextBoard);

        return {
            score,
            reward,
            bestMove,
            nextBoard,
        };
    }

    return noMovesReturn;
};
