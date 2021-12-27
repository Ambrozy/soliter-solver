import { BIN_INDEXES, Board, EMPTY, Move, Position } from './types';
import {
    copyBoard,
    getAt,
    getCardStackLength,
    getStackPossibleLength,
    isCompatible,
    isCompatibleBin,
    setAt,
} from './utils';

const isBinPosition = (position: Position) =>
    position[0] === 0 && BIN_INDEXES.includes(position[1]);

const isMoveBlockedCard = (board: Board, from: Position, to: Position) => {
    const maxStackLength = getStackPossibleLength(board, to[0] === 1);
    const stackLength = getCardStackLength(board, from);
    return stackLength === 0 || stackLength > maxStackLength;
};

const swapCards = (board: Board, from: Position, to: Position) => {
    const moveCard = getAt(board, from);

    setAt(board, from, EMPTY);
    setAt(board, to, moveCard);
};

export const nextState = (board: Board, move: Move): Board => {
    const [from, to] = move;
    const isToPlaceOrBin = to[0] === 0;
    const isMoveFromBin = () => isBinPosition(from);
    const isMoveToFilledPlace = () => !isBinPosition(to) && getAt(board, to) !== EMPTY;
    const isMoveNothing = () => getAt(board, from) === EMPTY;
    const isMoveToSelf = () => from[0] === to[0] && from[1] === to[1];
    const isMoveToWrongBin = () =>
        isBinPosition(to) && !isCompatibleBin(getAt(board, to), getAt(board, from));
    const isMoveToWrongColumn = () =>
        to[0] > 1 && !isCompatible(getAt(board, [to[0] - 1, to[1]]), getAt(board, from));
    const isMoveToNotLastColumnCard = () =>
        to[0] > 1 && getAt(board, [to[0] - 1, to[1]]) === EMPTY;
    const isMoveStackToPlaceOrBin = () =>
        isToPlaceOrBin && from[0] > 0 && getAt(board, [from[0] + 1, from[1]]) !== EMPTY;

    if (
        isMoveFromBin() ||
        isMoveToFilledPlace() ||
        isMoveNothing() ||
        isMoveToSelf() ||
        isMoveToWrongBin() ||
        isMoveToWrongColumn() ||
        isMoveToNotLastColumnCard() ||
        isMoveStackToPlaceOrBin()
    ) {
        return board;
    }

    const nextBoard = copyBoard(board);

    // card to place or bin
    if (isToPlaceOrBin) {
        swapCards(nextBoard, from, to);
        return nextBoard;
    }

    // card from place to column
    if (from[0] === 0) {
        const previousPosition = [to[0] - 1, to[1]] as Position;
        if (
            to[0] === 1 ||
            isCompatible(getAt(board, previousPosition), getAt(board, from))
        ) {
            swapCards(nextBoard, from, to);
            return nextBoard;
        }

        return board;
    }

    // card from column to column
    if (isMoveBlockedCard(board, from, to)) {
        return board;
    }

    const currentFromPosition = [...from] as Position;
    const currentToPosition = [...to] as Position;
    let currentCard = getAt(nextBoard, currentFromPosition);

    while (currentCard) {
        setAt(nextBoard, currentFromPosition, EMPTY);
        setAt(nextBoard, currentToPosition, currentCard);

        currentFromPosition[0] += 1;
        currentToPosition[0] += 1;
        currentCard = getAt(nextBoard, currentFromPosition);
    }

    return nextBoard;
};
