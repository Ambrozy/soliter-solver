import { Bin, isLose, isWin, moveToString, randomBoard } from '../../game';
import { asyncLoop, sample } from '../../utils';

import { LayersModel, Episode } from './model';
import { processOneMove } from './processOneMove';

export const playEpisode = async (
    model: LayersModel,
    expectedBin: Bin,
    stepsLimit: number,
    verbose = false,
): Promise<Episode> => {
    let board = randomBoard();

    return await asyncLoop(stepsLimit, 0, (steps) => {
        const { score, bestMove, nextBoard } = processOneMove(
            model,
            board,
            expectedBin,
            steps,
            sample,
        );
        const isWinCondition = isWin(board, expectedBin);
        const isLoseCondition = isLose(board);
        const result = {
            board,
            move: bestMove,
            score,
            done: isWinCondition || isLoseCondition,
        };

        if (verbose) {
            const currentStep = stepsLimit - steps;
            const win = isWinCondition ? 'win' : '';
            const lose = isLoseCondition ? 'lose' : '';
            const moveString = moveToString(board, bestMove);
            console.log(
                `[${currentStep}] Best move is ${moveString}, score is ${score}, ${win}${lose}`,
            );
        }

        board = nextBoard;

        if (result.done) {
            return Promise.reject(result);
        }

        return Promise.resolve(result);
    });
};
