import maxBy from 'lodash/maxBy';

import { force, randomInteger } from '../../utils';
import { tf } from './tf';
import { Episode } from './types';
import { prepareBoardX, toTfxBatch, toTfyBatch } from './utils';

type DataItem = {
    episode: Episode;
    maximumScore: number;
};

export class ReplayBuffer {
    #data: DataItem[] = [];
    length: number;
    batchSize: number;
    minPeriod: number;
    maxPeriod: number;

    constructor(length: number, batchSize: number, minPeriod: number, maxPeriod: number) {
        this.length = length;
        this.batchSize = batchSize;
        this.minPeriod = minPeriod;
        this.maxPeriod = maxPeriod;
    }

    count() {
        return {
            episodes: this.#data.length,
            steps: this.#data.reduce((sum, episode) => sum + episode.episode.length, 0),
        };
    }

    push(episode: Episode) {
        const maximumScore = maxBy(episode, 'score')?.score || 0;
        this.#data.push({ episode, maximumScore });
        this.#data.sort((a, b) => b.maximumScore - a.maximumScore);
        if (this.#data.length > this.length) {
            this.#data.shift();
        }
    }

    #getRandomPeriod(index: number): {
        boardX: number[][][];
        stepsX: number[];
        y: number[];
    } {
        const dataItem = this.#data[index];
        const maxEndIndex = dataItem.episode.length - 2;
        const randomIndex = randomInteger(this.minPeriod, maxEndIndex - this.minPeriod);
        const episodeSlice =
            maxEndIndex + 1 > this.minPeriod
                ? dataItem.episode.slice(
                      randomIndex,
                      Math.min(randomIndex + this.maxPeriod, maxEndIndex),
                  )
                : dataItem.episode.slice(0, maxEndIndex);
        const episodeStart = episodeSlice[0];
        const episodeScores = episodeSlice.map((step) => step.score);
        const maximumIndex = force(episodeScores);
        const maximumScore = episodeScores[maximumIndex];
        const length = maximumIndex - randomIndex;

        return {
            boardX: prepareBoardX(episodeStart.board, episodeStart.nextBoard),
            stepsX: [length],
            y: [maximumScore],
        };
    }

    *[Symbol.iterator]() {
        let index = 0;

        while (index < this.#data.length) {
            const batchBoardX: number[][][][] = [];
            const batchStepsX: number[][] = [];
            const batchY: number[][] = [];

            Array.from(Array(this.batchSize)).forEach(() => {
                if (this.#data[index].episode.length > 1) {
                    const period = this.#getRandomPeriod(index);

                    batchBoardX.push(period.boardX);
                    batchStepsX.push(period.stepsX);
                    batchY.push(period.y);
                }
            });
            index++;

            yield { xs: toTfxBatch(batchBoardX, batchStepsX), ys: toTfyBatch(batchY) };
        }
    }

    getDataset() {
        const iterator = this[Symbol.iterator].bind(this);

        return tf.data.generator(iterator);
    }
}
