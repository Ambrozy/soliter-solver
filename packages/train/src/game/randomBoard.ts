import { randomShuffle } from '../utils';
import type { Board } from './types';

export const randomBoard = (): Board => {
    const cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];
    const deck = cards.reduce(
        (acc, card) => [
            ...acc,
            card + 'c', // Черви
            card + 'k', // Крести
            card + 'p', // Пики
            card + 'b', // Бубны
        ],
        [],
    );
    const shuffled = randomShuffle(deck);
    const layout = [];

    while (shuffled.length > 0) {
        for (let i = 0; i < 8; i++) {
            if (!layout[i]) {
                layout[i] = [];
            }

            layout[i].push(shuffled.pop() || '');
        }
    }

    const fulledLayout = layout.map((column) =>
        Array.from(Array(22)).map((_, index) => column[index] || ''),
    );

    return {
        layout: fulledLayout,
        place: [],
        bin: {
            c: '',
            k: '',
            p: '',
            b: '',
        },
    };
};
