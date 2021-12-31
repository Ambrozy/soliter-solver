import { range } from '../utils';
import { isLose } from './gameEnds';
import {
    Board,
    CROSSES_INDEX,
    DIAMONDS_INDEX,
    HEARTS_INDEX,
    SPADES_INDEX,
} from './types';
import { getStackPossibleLength, isCompatible, toCardNumber } from './utils';

const sumSeries = (n: number) => Math.round((n * (n + 1)) / 2);

export const getBinScore = (board: Board) =>
    sumSeries(toCardNumber(board[0][HEARTS_INDEX])) +
    sumSeries(toCardNumber(board[0][CROSSES_INDEX])) +
    sumSeries(toCardNumber(board[0][SPADES_INDEX])) +
    sumSeries(toCardNumber(board[0][DIAMONDS_INDEX]));

export const getBoardScore = (board: Board) => {
    const stackPossibleLength = getStackPossibleLength(board);
    const binScore = getBinScore(board);
    let layoutScore = 0;

    for (const column of range(board[0].length)) {
        let stackLength = 0;
        let lastCard = board.at(-1).at(column);
        for (let level = board.length - 2; level >= 1; level--) {
            const card = board.at(level).at(column);

            if (card && isCompatible(card, lastCard)) {
                stackLength++;
            } else {
                layoutScore += sumSeries(stackLength);
                stackLength = 0;
            }
            lastCard = card;
        }
        layoutScore += sumSeries(stackLength);
    }

    return stackPossibleLength + binScore + layoutScore;
};

export const getBoardReward = (board: Board, nextBoard: Board) => {
    if (isLose(nextBoard)) {
        return -1;
    }

    const currentBinScore = getBinScore(board);
    const nextBinScore = getBinScore(nextBoard);

    return currentBinScore !== nextBinScore ? 1 : 0;
};

export const getBoardExtReward = (board: Board, nextBoard: Board) => {
    if (isLose(nextBoard)) {
        return -1;
    }

    const score = getBoardScore(board);
    const nextScore = getBoardScore(nextBoard);
    const sign = Math.sign(nextScore - score);

    return sign * 0.2 + getBoardReward(board, nextBoard);
};
