import maxBy from 'lodash/maxBy';

import { force, randomInteger } from '../../utils';
import { Episode, X, Y } from './types';
import { prepareBoardX } from './utils';

type DataItem = {
    episode: Episode;
    maximumScore: number;
};

export class ReplayBuffer {
    #data: DataItem[] = [];
    length: number;
    batchSize: number;
    minPeriod: number;

    constructor(length: number, batchSize: number, minPeriod: number) {
        this.length = length;
        this.batchSize = batchSize;
        this.minPeriod = minPeriod;
    }

    push(episode: Episode) {
        const maximumScore = maxBy(episode, 'score')?.score || 0;
        this.#data.push({ episode, maximumScore });
        this.#data.sort((a, b) => b.maximumScore - a.maximumScore);
        if (this.#data.length > this.length) {
            this.#data.shift();
        }
    }

    #getRandomPeriod(index: number): { x: X; y: Y } {
        const dataItem = this.#data[index];
        const stepCount = dataItem.episode.length;
        const randomIndex = randomInteger(this.minPeriod, stepCount - this.minPeriod);
        const episodeSlice =
            stepCount > this.minPeriod
                ? dataItem.episode.slice(randomIndex)
                : dataItem.episode;
        const episodeStart = episodeSlice[0];
        const episodeScores = episodeSlice.map((step) => step.score);
        const maximumIndex = force(episodeScores);
        const maximumScore = episodeScores[maximumIndex];
        const length = maximumIndex - randomIndex;

        return {
            x: [prepareBoardX(episodeStart.board, episodeStart.nextBoard), length],
            y: maximumScore,
        };
    }

    *[Symbol.iterator]() {
        let index = 0;

        while (index < this.length) {
            const batch_x: X[] = [];
            const batch_y: Y[] = [];

            Array.from(Array(this.batchSize)).forEach(() => {
                const period = this.#getRandomPeriod(index);

                batch_x.push(period.x);
                batch_y.push(period.y);
            });
            index++;

            yield [batch_x, batch_y];
        }
    }
}
