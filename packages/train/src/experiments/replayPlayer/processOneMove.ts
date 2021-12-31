import { getBoardReward, nextState } from '../../game';
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
        const board = episode[stepIndex].board;
        const nextBoard = nextState(board, bestMove);

        return {
            score,
            reward: getBoardReward(board, nextBoard),
            bestMove,
            nextBoard,
        };
    };
};
