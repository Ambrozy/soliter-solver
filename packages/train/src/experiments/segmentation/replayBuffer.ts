import maxBy from 'lodash/maxBy';

import { prettifyCards } from '../../utils';
import {
    getLastBinFromEpisode,
    encodeBoard,
    encodeExpectedBin,
    positionToIndexMap,
    randomBinFromEpisode,
    removeIneffectiveSteps,
} from '../common';
import { tf } from '../common/tf';
import { Episode } from '../common/types';

type DataItem = {
    episode: Episode;
    maximumScore: number;
};

export type ReplayBufferProps = {
    length: number;
    batchSize: number;
    leftEpisodesAfterOverflow?: number;
};

export class ReplayBuffer {
    #data: DataItem[] = [];
    length: number;
    props: ReplayBufferProps;

    constructor(props: ReplayBufferProps) {
        this.length = props.length;
        this.props = props;
    }

    /**
     * Return count of episodes and sum of each episode steps
     *
     * @return { episodes, steps }
     */
    count() {
        return {
            episodes: this.#data.length,
            steps: this.#data.reduce((sum, episode) => sum + episode.episode.length, 0),
        };
    }

    /**
     * Remove from raw episode data steps that not affect on board and if it has something to add than add it.
     * Then sort the data by maximum score and remove episodes with the smallest score.
     * It keeps data length less than `length` prop
     *
     * @param episode - raw episode data
     */
    push(episode: Episode) {
        const distillEpisode = removeIneffectiveSteps(episode);
        if (distillEpisode.length > 0) {
            const maximumScore = maxBy(distillEpisode, 'score')?.score || 0;
            this.#data.push({ episode: distillEpisode, maximumScore });
            this.#data.sort((a, b) => b.maximumScore - a.maximumScore);
        }

        if (this.#data.length > this.length) {
            const sliceLength = this.props.leftEpisodesAfterOverflow || this.length;
            this.#data = this.#data.slice(0, sliceLength);
        }
    }

    /**
     * Return prepared to model data item
     */
    *[Symbol.iterator]() {
        for (const episode of this.#data) {
            const episodeLength = episode.episode.length;

            for (let stepIndex = 0; stepIndex < episodeLength; stepIndex++) {
                const step = episode.episode[stepIndex];
                const boardOhe = encodeBoard(step.board);
                const expectedBin = randomBinFromEpisode(episode.episode);
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

    /**
     * Return tensorflow dataset from replay buffer episodes data.
     */
    getDataset() {
        const iterator = this[Symbol.iterator].bind(this);

        return tf.data.generator(iterator).batch(this.props.batchSize);
    }

    /**
     * Return table data of statistics about replay buffer episodes.
     *
     * @return [currentIndex, episodeFinalBin, episodeFinalScore, episodeLength][]
     */
    getStatistics() {
        return this.#data.map((episode, index) => {
            const lastBin = getLastBinFromEpisode(episode.episode);

            return [
                index + 1,
                prettifyCards(lastBin.join(' ')),
                episode.episode.at(-1).score,
                episode.episode.length,
            ];
        });
    }
}
