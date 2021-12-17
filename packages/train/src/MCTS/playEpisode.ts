import {
    Board,
    moveToString,
    nextState,
    NONE_MOVE,
    possibleMoves,
    randomBoard,
} from '../game';
import { asyncLoop, sample, scoreToProbabilities } from '../utils';

import { predictReward, LayersModel, Episode } from './model';
import { getBoardScore } from './score';

const processOneMove = (model: LayersModel, board: Board, steps: number) => {
    const moves = possibleMoves(board);

    if (moves.length) {
        const boards = moves.map((move) => [board, nextState(board, move)]);
        const predications = predictReward(model, boards, steps);
        const bestIndex = sample(scoreToProbabilities(predications));
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

export const playEpisode = async (
    model: LayersModel,
    stepsLimit: number,
    verbose = false,
): Promise<Episode> => {
    let board = randomBoard();
    const stepHistory: string[] = [];

    return await asyncLoop(stepsLimit, 0, (steps) => {
        const { score, bestMove, nextBoard } = processOneMove(model, board, steps);
        const result = { board, nextBoard, score };

        if (score === 0) {
            return Promise.reject();
        }

        stepHistory.push(bestMove);
        board = nextBoard;

        if (verbose) {
            console.log(
                `[${stepsLimit - steps}] Best move is ${stepHistory.at(
                    -1,
                )}, score is ${score}`,
            );
        }

        // eslint-disable-next-line compat/compat
        return Promise.resolve(result);
    });
};
