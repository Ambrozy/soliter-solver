import { Board } from '../game';
import { asyncLoop, force } from '../utils';

import { LayersModel } from './model';
import { processOneMove } from './processOneMove';

export const solveEpisode = async (
    model: LayersModel,
    stepsLimit: number,
    startBoard: Board,
): Promise<string[]> => {
    let board = startBoard;

    return await asyncLoop(stepsLimit, 0, (steps) => {
        const { score, bestMove, nextBoard } = processOneMove(model, board, steps, force);

        if (score === 0) {
            return Promise.reject();
        }

        board = nextBoard;
        // eslint-disable-next-line compat/compat
        return Promise.resolve(bestMove);
    });
};
