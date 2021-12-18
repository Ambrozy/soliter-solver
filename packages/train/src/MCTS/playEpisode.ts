import { randomBoard } from '../game';
import { asyncLoop } from '../utils';

import { LayersModel, Episode } from './model';
import { processOneMove } from './processOneMove';

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
