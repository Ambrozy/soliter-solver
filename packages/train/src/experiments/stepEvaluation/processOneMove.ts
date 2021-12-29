import { getBoardScore, nextState, possibleMoves } from '../../game';
import { scoreToProbabilities } from '../../utils';
import { binShape, encodeBoard, encodeExpectedBin, xShape } from '../common';
import { tf, Tensor } from '../common/tf';
import { ProcessOneMoveType } from '../common/types';

export const processOneMove: ProcessOneMoveType = (
    model,
    episode,
    board,
    bin,
    steps,
    sampler,
) => {
    const moves = possibleMoves(board);

    if (moves.length) {
        const bestMove = tf.tidy(() => {
            const moveCount = moves.length;
            const previousBoard = episode.length > 1 ? episode.at(-2).board : board;
            const boardsOhe = [encodeBoard(previousBoard), encodeBoard(board)];
            const binOhe = encodeExpectedBin(bin);

            const boards = moves.map((move) => [
                boardsOhe[0],
                boardsOhe[1],
                encodeBoard(nextState(board, move)),
            ]);
            const bins = moves.map(() => binOhe);
            const stepLimits = moves.map(() => steps);

            const boardTensor = tf.tensor(boards, [moveCount, 3, ...xShape], 'float32');
            const binTensor = tf.tensor(bins, [moveCount, ...binShape], 'float32');
            const stepsTensor = tf.tensor(stepLimits, [moveCount, 1], 'float32');
            const batch = [boardTensor, binTensor, stepsTensor];

            const predictions = model.predict(batch) as Tensor;
            const scores = Array.from(predictions.dataSync()) as number[];
            const moveIndex = sampler(scoreToProbabilities(scores));

            return moves[moveIndex];
        });
        const nextBoard = nextState(board, bestMove);

        return {
            score: getBoardScore(nextBoard),
            bestMove,
            nextBoard,
        };
    }

    return {
        score: 0,
        bestMove: [
            [0, 0],
            [0, 0],
        ],
        nextBoard: board,
    };
};
