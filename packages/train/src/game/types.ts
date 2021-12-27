export const HEARTS = 'c';
export const CROSSES = 'k';
export const SPADES = 'p';
export const DIAMONDS = 'b';
export const EMPTY = '';
export const PLACE_INDEXES = [0, 1, 2, 3];
export const HEARTS_INDEX = 4;
export const CROSSES_INDEX = 5;
export const SPADES_INDEX = 6;
export const DIAMONDS_INDEX = 7;
export const BIN_INDEXES = [HEARTS_INDEX, CROSSES_INDEX, SPADES_INDEX, DIAMONDS_INDEX];
export const NONE_MOVE = 'None';
export const CARDS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];
export const DECK = CARDS.reduce(
    (acc, card) => [
        ...acc,
        card + HEARTS, // Черви
        card + CROSSES, // Крести
        card + SPADES, // Пики
        card + DIAMONDS, // Бубны
    ],
    [],
);
export const UNKNOWN_CARD = 'u';

export type Suite = typeof HEARTS | typeof CROSSES | typeof SPADES | typeof DIAMONDS;
export type Board = string[][];
export type Bin = string[];
export type Position = [number, number];
export type Move = [Position, Position];
