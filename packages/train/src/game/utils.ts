import { Bin, Board, Move } from './types';
import { NONE_MOVE, PLACE } from './constants';

export const getSuite = (card: string) => card.at(-1) as keyof Board['bin'];
export const toCardNumber = (card: string) => {
    if (!card) {
        return 0;
    }

    const map: Record<string, number> = {
        '1': 10,
        J: 11,
        Q: 12,
        K: 13,
        A: 1,
    };

    return map[card.at(0)] || Number(card.at(0));
};
export const isRed = (card: string) => ['c', 'b'].includes(getSuite(card));
export const isCompatible = (bottom_card: string, top_card: string) =>
    isRed(bottom_card) !== isRed(top_card) &&
    toCardNumber(bottom_card) - toCardNumber(top_card) === 1;
export const isCompatibleBin = (bin: Bin, card: string) =>
    toCardNumber(card) - toCardNumber(bin[getSuite(card)]) === 1;
export const getLastCards = (layout: string[][]) => {
    const cards: string[] = [];
    const indexes: number[] = [];

    layout.forEach((column) => {
        for (let index = column.length - 1; index >= 0; index--) {
            if (column[index]) {
                cards.push(column[index]);
                indexes.push(index);
                break;
            }
        }
    });

    return [cards, indexes] as const;
};
export const getCompatibleIndexes = (lastCards: string[], card: string) => {
    const out: number[] = [];

    lastCards.forEach((columnCard, columnIndex) => {
        if (isCompatible(columnCard, card)) {
            out.push(columnIndex);
        }
    });

    return out;
};
export const getLeftSpace = (place: string[]) => 4 - place.length;
export const getStackPossibleLength = (place: string[], lastCards: string[]) => {
    const leftSpace = getLeftSpace(place);
    const emptyColumns = lastCards.filter((card) => !card).length;

    return (leftSpace + 1) * Math.max(1, emptyColumns);
};
export const moveToString = (board: Board, move: Move | typeof NONE_MOVE) => {
    if (move === NONE_MOVE) {
        return NONE_MOVE;
    }

    const [from, to] = move;
    const fromString =
        from[0] === PLACE ? board.place[from[1]] : board.layout[from[0]][from[1]];
    const toString = Array.isArray(to) ? board.layout[to[0]][to[1]] : to;

    return `${fromString} ${toString}`;
};
