import { Board, CardFromPosition, Move } from './types';
import {
    getCompatibleIndexes,
    getLastCards,
    getLeftSpace,
    getStackPossibleLength,
    isCompatible,
    isCompatibleBin,
} from './utils';
import { BIN, PLACE } from './constants';

const hasMove = (card: string, stack: string[], possibleLength: number): boolean => {
    const lastCard = stack.at(-1);
    const stackLength = stack.length;

    return (!lastCard || isCompatible(card, lastCard)) && stackLength <= possibleLength;
};

export const possibleMoves = (board: Board): Move[] => {
    const [lastCards, lastIndexes] = getLastCards(board.layout);
    const possibleLength = getStackPossibleLength(board.place, lastCards);
    let cardStack: string[] = [];
    const moves: Move[] = [];

    // from layout
    board.layout.forEach((column, fromColumnIndex) => {
        for (let fromCardIndex = column.length - 1; fromCardIndex >= 0; fromCardIndex--) {
            const card = column[fromCardIndex];
            if (card) {
                if (!hasMove(card, cardStack, possibleLength)) {
                    break;
                }
                if (card) {
                    cardStack.push(card);
                }

                const from = [fromColumnIndex, fromCardIndex] as CardFromPosition;

                // to layout
                const columnIndexes = getCompatibleIndexes(lastCards, card);
                const layoutMoves = columnIndexes
                    .filter((toColumnIndex) => toColumnIndex !== fromColumnIndex)
                    .map((toColumnIndex) => [
                        from,
                        [toColumnIndex, lastIndexes[toColumnIndex]],
                    ]);
                moves.push(...(layoutMoves as Move[]));

                // to place
                if (cardStack.length === 1 && getLeftSpace(board.place)) {
                    moves.push([from, PLACE]);
                }

                // to bin
                if (cardStack.length === 1 && isCompatibleBin(board.bin, card)) {
                    moves.push([from, BIN]);
                }
            }
        }

        cardStack = [];
    });

    // from place
    board.place.forEach((card, fromCardIndex) => {
        const from = [PLACE, fromCardIndex];
        // to layout
        const columnIndexes = getCompatibleIndexes(lastCards, card);
        const layoutMoves = columnIndexes.map((toColumnIndex) => [
            from,
            [toColumnIndex, lastIndexes[toColumnIndex]],
        ]);
        moves.push(...(layoutMoves as Move[]));

        // to bin
        if (isCompatibleBin(board.bin, card)) {
            moves.push([from, BIN] as Move);
        }
    });

    return moves;
};
