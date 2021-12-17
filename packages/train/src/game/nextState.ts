import cloneDeep from 'lodash/cloneDeep';

import { BIN, PLACE } from './constants';
import { Board, CardFromPosition, Move } from './types';
import { getSuite } from './utils';

const updateBoardFromPlace = (board: Board, from: CardFromPosition) => {
    const card = board.place[from[1]];
    board.place.splice(from[1], 1);
    return card;
};

const updateBoardFrom = (board: Board, from: [number, number]) => {
    const card = board.layout[from[0]][from[1]];
    board.layout[from[0]][from[1]] = '';
    return card;
};

const updateBoardTo = (board: Board, card: string, to: [number, number]) => {
    board.layout[to[0]][to[1] + 1] = card;
};

const nextStateBin = (board: Board, from: CardFromPosition): Board => {
    const nextBoard = cloneDeep(board);
    const card =
        from[0] === PLACE
            ? updateBoardFromPlace(nextBoard, from)
            : updateBoardFrom(nextBoard, from);
    nextBoard.bin[getSuite(card)] = card;
    return nextBoard;
};

const nextStatePlace = (board: Board, from: [number, number]): Board => {
    const nextBoard = cloneDeep(board);
    const card = updateBoardFrom(nextBoard, from);
    nextBoard.place.push(card);
    return nextBoard;
};

export const nextState = (board: Board, move: Move): Board => {
    const [from, to] = move;

    if (from[0] === to[0]) {
        console.log(
            board.layout[from[0] as number][from[1]],
            board.layout[to[0] as number][to[1] as number],
        );
        return board;
    }

    if (to === BIN) {
        return nextStateBin(board, from);
    }
    if (to === PLACE) {
        return from[0] === PLACE ? board : nextStatePlace(board, from);
    }

    const nextBoard = cloneDeep(board);

    if (from[0] === PLACE) {
        const card = updateBoardFromPlace(nextBoard, from);
        updateBoardTo(nextBoard, card, to);
    } else {
        const fromPosition = [from[0], from[1]] as [number, number];
        const toPosition = [to[0], to[1]] as [number, number];

        while (true) {
            const layoutCard = updateBoardFrom(nextBoard, fromPosition);

            if (!layoutCard) {
                break;
            }

            updateBoardTo(nextBoard, layoutCard, toPosition);

            fromPosition[1] += 1;
            toPosition[1] += 1;
        }
    }

    return nextBoard;
};
