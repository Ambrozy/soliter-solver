import {
    encodeBoard,
    encodeExpectedBin,
    positionToIndexMap,
    randomBinFromEpisode,
    removeIneffectiveSteps,
} from '../common';
import { Episode } from '../common/types';
import { ReplayBuffer } from '../common/ReplayBuffer';

export class MapReplayBuffer extends ReplayBuffer {
    push(episode: Episode) {
        super.push(removeIneffectiveSteps(episode));
    }

    *[Symbol.iterator]() {
        for (const episode of this._data) {
            const episodeLength = episode.length;

            for (let stepIndex = 0; stepIndex < episodeLength; stepIndex++) {
                const step = episode[stepIndex];
                const boardOhe = encodeBoard(step.board);
                const expectedBin = randomBinFromEpisode(episode);
                const expectedBinOhe = encodeExpectedBin(expectedBin);
                const stepLimit = episodeLength - stepIndex;
                const indexMapFrom = positionToIndexMap(step.move[0]);
                const indexMapTo = positionToIndexMap(step.move[1]);

                yield {
                    xs: {
                        board: boardOhe,
                        expectedBin: expectedBinOhe,
                        stepsLimit: [stepLimit],
                    },
                    ys: {
                        from: indexMapFrom,
                        to: indexMapTo,
                    },
                };
            }
        }
    }
}
