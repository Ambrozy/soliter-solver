import { nextState } from '../../game';
import { getNoMovesReturn, stringsToEpisode } from '../common';
import type { ProcessOneMoveType, Replay } from '../common/types';

export const getReplayProcessOneMove = (replay: Replay): ProcessOneMoveType => {
    const episode = stringsToEpisode(replay.startBoard, replay.history);

    return (_, __, ___, ____, _____, ______, stepIndex) => {
        if (!episode[stepIndex]) {
            return getNoMovesReturn(episode[stepIndex - 1].board);
        }

        const score = episode[stepIndex].score;
        const bestMove = episode[stepIndex].move;
        const nextBoard = nextState(episode[stepIndex].board, bestMove);

        return {
            score,
            bestMove,
            nextBoard,
        };
    };
};
