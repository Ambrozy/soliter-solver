import { BIN_INDEXES, Board, EMPTY, Move, PLACE_INDEXES, Position } from './types';
import {
    getAt,
    getCardStackLength,
    getLastCards,
    getStackPossibleLength,
    isCompatible,
    isCompatibleBin,
} from './utils';
import { range } from '../utils';

const getCompatibleColumnIndexes = (
    card: string,
    lastCards: string[],
    excludeColumnIndex: number,
) => {
    const indexes: number[] = [];

    lastCards.forEach((lastCard, columnIndex) => {
        if (isCompatible(lastCard, card) && columnIndex !== excludeColumnIndex) {
            indexes.push(columnIndex);
        }
    });

    return indexes;
};

export const possibleMoves = (board: Board): Move[] => {
    const [lastCards, lastIndexes] = getLastCards(board);
    const maxStackLength = getStackPossibleLength(board);
    const maxEmptyColumnStackLength = getStackPossibleLength(board, true);
    const moves: Move[] = [];

    const getToLayoutMoves = (card: string, from: Position, stackLength: number) => {
        const column = from[1];
        const indexes = getCompatibleColumnIndexes(card, lastCards, column);

        return indexes
            .map((columnIndex) => {
                const toLevel = lastIndexes[columnIndex];
                return [toLevel === 1 ? 1 : toLevel + 1, columnIndex];
            })
            .filter(
                (to) =>
                    (to[0] === 1 && stackLength <= maxEmptyColumnStackLength) ||
                    (to[0] > 1 && stackLength <= maxStackLength),
            )
            .map((to) => [from, to] as Move);
    };
    const getToBinMoves = (card: string, from: Position) =>
        BIN_INDEXES.filter((columnIndex) =>
            isCompatibleBin(getAt(board, [0, columnIndex]), card),
        ).map((columnIndex) => [from, [0, columnIndex]] as Move);
    const getToPlaceMoves = (from: Position) =>
        PLACE_INDEXES.filter(
            (columnIndex) => getAt(board, [0, columnIndex]) === EMPTY,
        ).map((columnIndex) => [from, [0, columnIndex]] as Move);

    // from layout
    for (const column of range(board[0].length)) {
        for (let level = 1; level < board.length; level++) {
            const from = [level, column] as Position;
            const card = getAt(board, from);
            const stackLength = getCardStackLength(board, from);
            if (stackLength > 0) {
                // to layout
                const toLayoutMoves = getToLayoutMoves(card, from, stackLength);
                moves.push(...toLayoutMoves);
            }
            if (stackLength === 1) {
                // to place
                const toPlaceMoves = getToPlaceMoves(from);
                moves.push(...toPlaceMoves);

                // to bin
                const toBinMoves = getToBinMoves(card, from);
                moves.push(...toBinMoves);
            }
        }
    }

    // from place
    PLACE_INDEXES.forEach((columnIndex) => {
        const from = [0, columnIndex] as Position;
        const card = getAt(board, from);

        if (card) {
            // to layout
            const toLayoutMoves = getToLayoutMoves(card, from, 0);
            moves.push(...toLayoutMoves);

            // to bin
            const toBinMoves = getToBinMoves(card, from);
            moves.push(...toBinMoves);
        }
    });

    return moves;
};
