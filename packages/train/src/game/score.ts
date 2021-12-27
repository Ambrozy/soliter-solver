import { range } from '../utils';
import {
    Board,
    CROSSES_INDEX,
    DIAMONDS_INDEX,
    HEARTS_INDEX,
    SPADES_INDEX,
} from './types';
import { getStackPossibleLength, isCompatible, toCardNumber } from './utils';

const sumSeries = (n: number) => Math.round((n * (n + 1)) / 2);

export const getBoardScore = (board: Board) => {
    const stackPossibleLength = getStackPossibleLength(board);
    const binScore =
        sumSeries(toCardNumber(board[0][HEARTS_INDEX])) +
        sumSeries(toCardNumber(board[0][CROSSES_INDEX])) +
        sumSeries(toCardNumber(board[0][SPADES_INDEX])) +
        sumSeries(toCardNumber(board[0][DIAMONDS_INDEX]));
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

    return stackPossibleLength + 2 * binScore + layoutScore;
};
