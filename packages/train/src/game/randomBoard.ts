import { array2d, randomShuffle, range } from '../utils';
import { Board, DECK, EMPTY } from './types';

export const randomBoard = (): Board => {
    const deck = [...DECK];
    const numColumns = 8;
    const shuffled = randomShuffle(deck);
    const layout = array2d([23, numColumns], EMPTY);

    let level = 1; // level === 0 is place & bin
    while (shuffled.length > 0) {
        for (const column of range(numColumns)) {
            layout[level][column] = shuffled.pop() || EMPTY;
        }

        level += 1;
    }

    return layout;
};
