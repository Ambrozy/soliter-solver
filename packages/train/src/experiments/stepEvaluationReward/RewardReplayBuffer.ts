import {
    encodeBoard,
    getNextEpisodeBoard,
    getPreviousEpisodeBoard,
    smoothEpisodeReward,
} from '../common';
import { ReplayBuffer, ReplayBufferProps } from '../common/ReplayBuffer';
import { Episode } from '../common/types';

export type RewardReplayBufferProps = ReplayBufferProps & {
    gamma: number;
};

export class RewardReplayBuffer extends ReplayBuffer {
    props: RewardReplayBufferProps;

    constructor(props: RewardReplayBufferProps) {
        super(props);
        this.props = props;
    }

    push(episode: Episode) {
        super.push(smoothEpisodeReward(episode, this.props.gamma));
    }

    *[Symbol.iterator]() {
        for (const episode of this._data) {
            const episodeLength = episode.length;

            for (let stepIndex = 0; stepIndex < episodeLength; stepIndex++) {
                const step = episode[stepIndex];
                const previousBoardOhe = encodeBoard(
                    getPreviousEpisodeBoard(episode, stepIndex),
                );
                const boardOhe = encodeBoard(step.board);
                const nextBoardOhe = encodeBoard(getNextEpisodeBoard(episode, stepIndex));

                yield {
                    xs: [previousBoardOhe, boardOhe, nextBoardOhe],
                    ys: step.reward,
                };
            }
        }
    }
}
