import { Move, getBoardScore, nextState, Position, getBoardReward } from '../../game';
import { scoreToProbabilities } from '../../utils';
import { binShape, encodeBoard, encodeExpectedBin, xShape } from '../common';
import { tf, Tensor } from '../common/tf';
import { ProcessOneMoveType, SamplerType } from '../common/types';

export const predictionToPosition = (
    indexMap: number[],
    sampler: SamplerType,
    threshold: number,
): Position => {
    const globalIndex = sampler(scoreToProbabilities(indexMap, threshold));
    const levelIndex = Math.floor(globalIndex / 8);
    const columnIndex = globalIndex - levelIndex * 8;

    return [levelIndex, columnIndex];
};

export const processOneMove: ProcessOneMoveType = (
    model,
    _,
    board,
    bin,
    steps,
    sampler,
) => {
    const bestMove = tf.tidy(() => {
        const boardOhe = [encodeBoard(board)];
        const binOhe = [encodeExpectedBin(bin)];

        const boardTensor = tf.tensor(boardOhe, [1, ...xShape], 'float32');
        const binTensor = tf.tensor(binOhe, [1, ...binShape], 'float32');
        const stepsTensor = tf.tensor(steps, [1, 1], 'float32');
        const batch = [boardTensor, binTensor, stepsTensor];

        const [from, to] = model.predict(batch) as Tensor[];
        const fromIndex = Array.from(from.dataSync()) as number[];
        const toIndex = Array.from(to.dataSync()) as number[];

        return [
            predictionToPosition(fromIndex, sampler, 0.5),
            predictionToPosition(toIndex, sampler, 0.5),
        ] as Move;
    });
    const nextBoard = nextState(board, bestMove);

    return {
        score: getBoardScore(nextBoard),
        reward: getBoardReward(board, nextBoard),
        bestMove,
        nextBoard,
    };
};
