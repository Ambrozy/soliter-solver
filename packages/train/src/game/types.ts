import type { BIN, PLACE } from './constants';

export interface Bin {
    c: string; // Черви
    k: string; // Крести
    p: string; // Пики
    b: string; // Бубны
}

export interface Board {
    layout: string[][];
    place: string[];
    bin: Bin;
}

export type CardFromPosition = [number, number] | [typeof PLACE, number];
export type CardToPosition = [number, number] | typeof PLACE | typeof BIN;
export type Move = [CardFromPosition, CardToPosition];
