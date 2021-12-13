import flattenDeep from 'lodash/flattenDeep';
import { Board, randomBoard } from '../../game';
import { tf } from './tf';
import { X } from './types';

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

const fill1DValues = (
    values: Float32Array,
    data: string[],
    fromIndex: number,
    length: number,
) => {
    for (const i of Array(length).keys()) {
        const cardOhe = boardOheMap[data[i] || ''];

        for (const channel of Array(oheLength).keys()) {
            values[fromIndex + i * oheLength + channel] = cardOhe[channel];
        }
    }
};
const fill2DValues = (values: Float32Array, data: string[][], fromIndex: number) => {
    data.forEach((column, columnIndex) => {
        const columnSize = column.length;

        column.forEach((card, cardIndex) => {
            const cardOhe = boardOheMap[card || ''];

            for (const channel of Array(oheLength).keys()) {
                const valueIndex =
                    fromIndex +
                    (columnIndex * columnSize + cardIndex) * oheLength +
                    channel;

                values[valueIndex] = cardOhe[channel];
            }
        });
    });
};

export const prepareBoardX = (board: Board, nextBoard: Board) => {
    const width = 8;
    const height = 2 * (board.layout[0].length + 1); // 2 boards with place, bin, layout
    const values = new Float32Array(width * height * oheLength);

    fill1DValues(values, board.place, 0, 4);
    fill1DValues(values, nextBoard.place, 8 * oheLength, 4);
    fill1DValues(values, Object.values(board.bin), 4 * oheLength, 4);
    fill1DValues(values, Object.values(nextBoard.bin), 12 * oheLength, 4);
    fill2DValues(values, board.layout, 16 * oheLength);
    fill2DValues(values, nextBoard.layout, (16 + 8 * board.layout[0].length) * oheLength);

    return tf.tensor3d(values, [width, height, oheLength], 'float32');
};

export const prepareBatch = (boards: Board[][], steps: number): X[] =>
    boards.map((boardStack) => [prepareBoardX(boardStack[0], boardStack[1]), steps]);
