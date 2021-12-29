import { ReplayBuffer } from '../common/ReplayBuffer';
import {
    encodeBoard,
    encodeExpectedBin,
    getFinalScore,
    randomBinFromEpisode,
} from '../common';
import { nextState } from '../../game';

export class ScoreReplayBuffer extends ReplayBuffer {
    *[Symbol.iterator]() {
        for (const episode of this._data) {
            const episodeLength = episode.length;

            for (let stepIndex = 0; stepIndex < episodeLength; stepIndex++) {
                const step = episode[stepIndex];
                const previousStep = stepIndex === 0 ? step : episode[stepIndex - 1];
                const nextStep =
                    stepIndex === episodeLength - 1
                        ? { board: nextState(step.board, step.move) }
                        : episode[stepIndex + 1];

                const previousBoardOhe = encodeBoard(previousStep.board);
                const boardOhe = encodeBoard(step.board);
                const nextBoardOhe = encodeBoard(nextStep.board);

                const expectedBin = randomBinFromEpisode(episode);
                const expectedBinOhe = encodeExpectedBin(expectedBin);
                const stepLimit = episodeLength - stepIndex;
                const finalScore = getFinalScore(episode);

                yield {
                    xs: {
                        boards: [previousBoardOhe, boardOhe, nextBoardOhe],
                        expectedBin: expectedBinOhe,
                        stepsLimit: [stepLimit],
                    },
                    ys: finalScore,
                };
            }
        }
    }
}
