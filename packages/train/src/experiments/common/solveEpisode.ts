import { Bin, Board, moveToString } from '../../game';
import { force } from '../../utils';
import { playEpisode } from './playEpisode';
import type { LayersModel } from './tf';
import type { ProcessOneMoveType } from './types';

export const solveEpisode = async (
    model: LayersModel,
    processOneMove: ProcessOneMoveType,
    startBoard: Board,
    expectedBin: Bin,
    stepsLimit: number,
): Promise<string[]> => {
    const episode = await playEpisode(
        model,
        processOneMove,
        startBoard,
        expectedBin,
        stepsLimit,
        force,
    );

    return episode.map((step) => moveToString(step.board, step.move));
};
