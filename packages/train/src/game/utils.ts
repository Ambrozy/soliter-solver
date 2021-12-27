import {
    BIN_INDEXES,
    HEARTS,
    DIAMONDS,
    NONE_MOVE,
    PLACE_INDEXES,
    Board,
    Move,
    Suite,
    Position,
    EMPTY,
    DECK,
} from './types';

export const getSuite = (card: string) => card.at(-1) as Suite;
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
export const isRed = (card: string) => [HEARTS, DIAMONDS].includes(getSuite(card));
export const isCompatible = (bottomCard: string, topCard: string) =>
    bottomCard === EMPTY ||
    (isRed(bottomCard) !== isRed(topCard) &&
        toCardNumber(bottomCard) - toCardNumber(topCard) === 1);
export const isCompatibleBin = (binCard: string, card: string) =>
    (binCard === EMPTY && toCardNumber(card) === 1) ||
    (getSuite(binCard) === getSuite(card) &&
        toCardNumber(card) - toCardNumber(binCard) === 1);
export const getAt = (board: Board, position: Position) =>
    board[position[0]]?.[position[1]];
export const setAt = (board: Board, position: Position, value: string) => {
    board[position[0]][position[1]] = value;
};
export const getLastCards = (board: Board) => {
    const cards: string[] = [];
    const indexes: number[] = [];

    for (let columnIndex = 0; columnIndex < board[0].length; columnIndex++) {
        for (let levelIndex = 1; levelIndex <= board.length; levelIndex++) {
            const currentCard = getAt(board, [levelIndex, columnIndex]);
            if (!currentCard) {
                const previousLevel = Math.max(levelIndex - 1, 1);
                cards[columnIndex] = getAt(board, [previousLevel, columnIndex]);
                indexes[columnIndex] = previousLevel;
                break;
            }
        }
    }

    return [cards, indexes] as const;
};
export const getLeftSpace = (board: Board) =>
    PLACE_INDEXES.filter((index) => getAt(board, [0, index]) === EMPTY).length;
export const getStackPossibleLength = (board: Board, toEmptyColumn?: boolean) => {
    const leftSpace = getLeftSpace(board);
    const emptyColumns = board[1].filter((card) => card === EMPTY).length;

    return (leftSpace + 1) * (1 + emptyColumns - Number(Boolean(toEmptyColumn)));
};
export const copyBoard = (board: Board) => board.map((level) => [...level]);
export const isValidCard = (card: string) => card === '' || DECK.includes(card);
export const getCardStackLength = (board: Board, from: Position) => {
    const currentPosition = [...from] as Position;
    let currentCard = getAt(board, currentPosition);
    let previousCard = undefined;
    let stackLength = 0;

    while (currentCard) {
        if (previousCard !== undefined && !isCompatible(previousCard, currentCard)) {
            return 0;
        }

        currentPosition[0] += 1;
        stackLength += 1;
        previousCard = currentCard;
        currentCard = getAt(board, currentPosition);
    }

    return stackLength;
};

export const moveToString = (board: Board, move: Move | typeof NONE_MOVE) => {
    if (move === NONE_MOVE) {
        return NONE_MOVE;
    }

    const [from, to] = move;
    const fromString = board[from[0]][from[1]];

    const isToPlace = to[0] === 0 && PLACE_INDEXES.includes(to[1]);
    const isToBin = to[0] === 0 && BIN_INDEXES.includes(to[1]);

    let toString;
    if (isToPlace) {
        toString = 'place';
    } else if (isToBin) {
        toString = 'bin';
    } else {
        toString = board[to[0]][Math.min(1, to[1] - 1)];
    }
    if (!toString) {
        // eslint-disable-next-line quotes
        toString = "''";
    }

    return `${fromString} ${toString}`;
};
