import { Bin, Board, isLose, isWin, moveToString } from '../../game';
import { asyncLoop, sample } from '../../utils';
import type { LayersModel } from './tf';
import type { Episode, ProcessOneMoveType, SamplerType } from './types';

export const playEpisode = async (
    model: LayersModel,
    processOneMove: ProcessOneMoveType,
    startBoard: Board,
    expectedBin: Bin,
    stepsLimit: number,
    sampler: SamplerType = sample,
    verbose = false,
): Promise<Episode> => {
    let board = startBoard;
    const episode: Episode = [];

    await asyncLoop(stepsLimit, 0, (steps) => {
        const { score, bestMove, nextBoard } = processOneMove(
            model,
            episode,
            board,
            expectedBin,
            steps,
            sampler,
            stepsLimit - steps,
        );
        const isWinCondition = isWin(board, expectedBin);
        const isLoseCondition = isLose(board) || score === 0;

        episode.push({
            board,
            move: bestMove,
            score: isLoseCondition ? 0 : score,
            done: isWinCondition || isLoseCondition,
        });

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

        if (episode.at(-1).done) {
            return Promise.reject();
        }

        return Promise.resolve();
    });

    return episode;
};
