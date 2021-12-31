import { getBoardReward, getBoardScore, nextState, possibleMoves } from '../../game';
import { scoreToProbabilities } from '../../utils';
import { encodeBoard, getNoMovesReturn, xShape } from '../common';
import { tf, Tensor } from '../common/tf';
import { ProcessOneMoveType } from '../common/types';

export const processOneMove: ProcessOneMoveType = (
    model,
    episode,
    board,
    _,
    __,
    sampler,
) => {
    const moves = possibleMoves(board);

    if (moves.length) {
        const bestMove = tf.tidy(() => {
            const moveCount = moves.length;
            const previousBoard = episode.length > 1 ? episode.at(-2).board : board;
            const boardsOhe = [encodeBoard(previousBoard), encodeBoard(board)];

            const boards = moves.map((move) => [
                boardsOhe[0],
                boardsOhe[1],
                encodeBoard(nextState(board, move)),
            ]);

            const batch = tf.tensor(boards, [moveCount, 3, ...xShape], 'float32');

            const predictions = model.predict(batch) as Tensor;
            const scores = Array.from(predictions.dataSync()) as number[];
            const moveIndex = sampler(scoreToProbabilities(scores, 0.5));

            return moves[moveIndex];
        });
        const nextBoard = nextState(board, bestMove);

        return {
            score: getBoardScore(nextBoard),
            reward: getBoardReward(board, nextBoard),
            bestMove,
            nextBoard,
        };
    }

    return getNoMovesReturn(board);
};
