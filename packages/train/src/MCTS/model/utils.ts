import flattenDeep from 'lodash/flattenDeep';
import { Bin, Board, randomBoard } from '../../game';
import { tf } from './tf';
import { X, Y } from './types';

const toOhe = (index: number, length: number) =>
    Array.from(Array(length)).map((_, currentIndex) => (currentIndex === index ? 1 : 0));
const getBoardOheMap = () => {
    const board = randomBoard();
    const cardSet = new Set(flattenDeep(board.layout));
    const setLength = cardSet.size;
    const oheMap: Record<string, number[]> = {};

    Array.from(cardSet).forEach((card, index) => {
        oheMap[card] = toOhe(index, setLength);
    });

    return [oheMap, setLength] as const;
};

export const [boardOheMap, oheLength] = getBoardOheMap();

const placeToArray = (place: string[]) =>
    Array.from(Array(4)).map((_, index) => boardOheMap[place[index] || '']);
const binToArray = (bin: Bin) =>
    Object.values(bin).map((key: keyof Bin) => boardOheMap[bin[key] || '']);
const layoutToArray = (layout: string[][]) => {
    const out: number[][][] = []; // 22x8x53

    layout.forEach((column, columnIndex) => {
        column.forEach((card, cardIndex) => {
            if (!out[cardIndex]) {
                out[cardIndex] = [];
            }

            out[cardIndex][columnIndex] = boardOheMap[card];
        });
    });

    return out;
};

const rndBoard = randomBoard();
export const xShape = [
    2 * (rndBoard.layout[0].length + 1), // 2 boards with place, bin, layout = 46
    rndBoard.layout.length, // 8
    oheLength, // 11
];
export const prepareBoardX = (board: Board, nextBoard: Board) => [
    [...placeToArray(board.place), ...binToArray(board.bin)], // 1x8x53
    ...layoutToArray(board.layout), // 22x8x53
    [...placeToArray(nextBoard.place), ...binToArray(nextBoard.bin)],
    ...layoutToArray(nextBoard.layout),
];

export const toTfxBatch = (boardStates: number[][][][], stepStates: number[][]): X => [
    tf.tensor4d(
        boardStates,
        [boardStates.length, xShape[0], xShape[1], xShape[2]],
        'float32',
    ),
    tf.tensor2d(stepStates, [boardStates.length, 1], 'float32'),
];

export const toTfyBatch = (ys: number[][]): Y =>
    tf.tensor2d(ys, [ys.length, 1], 'float32');

export const prepareBatch = (boards: Board[][], steps: number): X =>
    toTfxBatch(
        // @ts-ignore
        boards.map((boardStack) => prepareBoardX(boardStack[0], boardStack[1])),
        boards.map(() => [steps]),
    );
