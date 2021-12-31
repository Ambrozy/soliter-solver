import { prettifyCards } from '../../utils';
import { tf } from './tf';
import type { Episode } from './types';
import { getLastBinFromEpisode, getFinalScore } from './utils';

export type ReplayBufferProps = {
    length: number;
    batchSize: number;
    leftEpisodesAfterOverflow?: number;
};

export class ReplayBuffer {
    _data: Episode[] = [];
    length = 0;
    props: ReplayBufferProps;

    constructor(props: ReplayBufferProps) {
        this.props = props;
    }

    /**
     * Return count of episodes and sum of each episode steps
     *
     * @return { episodes, steps }
     */
    count() {
        return {
            episodes: this._data.length,
            steps: this.length,
        };
    }

    /**
     * Update length of replay buffer according to contained episodes
     */
    updateLength() {
        this.length = this._data.reduce((sum, episode) => sum + episode.length, 0);
    }

    /**
     * Remove from raw episode data steps that not affect on board and if it has something to add than add it.
     * Then sort the data by maximum score and remove episodes with the smallest score.
     * It keeps data length less than `length` prop
     *
     * @param episode - raw episode data
     */
    push(episode: Episode) {
        if (episode.length > 0) {
            this._data.push(episode);
            this._data.sort((a, b) => getFinalScore(b, -2) - getFinalScore(a, -2));
            this.length += episode.length;
        }

        if (this._data.length > this.props.length) {
            const sliceLength = this.props.leftEpisodesAfterOverflow || this.props.length;
            this._data = this._data.slice(0, sliceLength);
            this.updateLength();
        }
    }

    /**
     * Return prepared to model data item
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    *[Symbol.iterator](): any {
        throw new Error(
            'Error: "Symbol.iterator" is not implemented. It should yield { xs, ys }',
        );

        yield;
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
        return this._data.map((episode, index) => {
            const lastBin = getLastBinFromEpisode(episode);

            return [
                index + 1,
                prettifyCards(lastBin.join(' ')),
                getFinalScore(episode),
                episode.length,
            ];
        });
    }
}
