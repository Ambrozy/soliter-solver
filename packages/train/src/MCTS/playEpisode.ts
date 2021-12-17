import {
    Board,
    moveToString,
    nextState,
    NONE_MOVE,
    possibleMoves,
    randomBoard,
} from '../game';
import { sample, scoreToProbabilities } from '../utils';

import { predictReward, Episode, LayersModel } from './model';
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

export const playEpisode = (model: LayersModel, stepsLimit: number) => {
    let board = randomBoard();
    const stepHistory = [];
    const episodeTape: Episode = [];

    for (let steps = stepsLimit; steps > 0; steps--) {
        const { score, bestMove, nextBoard } = processOneMove(model, board, steps);

        if (score === 0) {
            break;
        }

        stepHistory.push(bestMove);
        episodeTape.push({
            board,
            nextBoard,
            score,
        });
        board = nextBoard;
        console.log(
            `[${stepsLimit - steps}] Best move is ${stepHistory.at(
                -1,
            )}, score is ${score}`,
        );
    }

    return episodeTape;
};
