import { Bin, Board, isLose, isWin, moveToString } from '../game';
import { asyncLoop, force } from '../utils';

import { LayersModel } from './model';
import { processOneMove } from './processOneMove';

export const solveEpisode = async (
    model: LayersModel,
    startBoard: Board,
    expectedBin: Bin,
    stepsLimit: number,
): Promise<string[]> => {
    let board = startBoard;

    return await asyncLoop(stepsLimit, 0, (steps) => {
        const { bestMove, nextBoard } = processOneMove(
            model,
            board,
            expectedBin,
            steps,
            force,
        );
        const isWinCondition = isWin(board, expectedBin);
        const isLoseCondition = isLose(board);
        const moveString = moveToString(board, bestMove);
        const result =
            steps === stepsLimit || board !== nextBoard ? moveString : undefined;

        if (isWinCondition || isLoseCondition) {
            const win = isWinCondition ? ' win' : '';
            const lose = isLoseCondition ? ' lose' : '';

            return Promise.reject(moveString + win + lose);
        }

        board = nextBoard;

        return Promise.resolve(result);
    });
};
