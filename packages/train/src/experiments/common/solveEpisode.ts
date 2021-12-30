import { Bin, Board, moveToString } from '../../game';
import { force } from '../../utils';
import { playEpisode } from './playEpisode';
import type { LayersModel } from './tf';
import type { ProcessOneMoveType } from './types';
import { getLastBinFromEpisode } from './utils';

export const solveEpisode = async (
    model: LayersModel,
    processOneMove: ProcessOneMoveType,
    startBoard: Board,
    expectedBin: Bin,
    stepsLimit: number,
    verbose = false,
): Promise<{
    history: string[];
    finalBin: string[];
}> => {
    const episode = await playEpisode(
        model,
        processOneMove,
        startBoard,
        expectedBin,
        stepsLimit,
        force,
        verbose,
    );
    const finalBin = getLastBinFromEpisode(episode);
    const history = episode.map((step) => moveToString(step.board, step.move));

    return {
        history,
        finalBin,
    };
};
