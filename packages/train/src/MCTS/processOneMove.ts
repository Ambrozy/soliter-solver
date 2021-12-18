import { Board, moveToString, nextState, NONE_MOVE, possibleMoves } from '../game';
import { sample, scoreToProbabilities } from '../utils';

import { LayersModel, predictReward } from './model';
import { getBoardScore } from './score';

export const processOneMove = (
    model: LayersModel,
    board: Board,
    steps: number,
    sampler = sample,
) => {
    const moves = possibleMoves(board);

    if (moves.length) {
        const boards = moves.map((move) => [board, nextState(board, move)]);
        const predications = predictReward(model, boards, steps);
        const bestIndex = sampler(scoreToProbabilities(predications));
        const bestMove = moves[bestIndex];
        const nextBoard = boards[bestIndex][1];

        return {
            score: getBoardScore(nextBoard),
            bestMove: moveToString(board, bestMove),
            nextBoard,
        };
    }

    return { score: 0, bestMove: moveToString(board, NONE_MOVE), nextBoard: board };
};
