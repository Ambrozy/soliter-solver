import type { Board, Position } from '../types';

export const filledZeroLevel = ['2c', '2k', '2p', '2b', 'Jc', '3k', '3p', '3b'];
export const freeBoard = [
    ['', '', '', '', '', '', '', ''],
    ['Kk', '', '2c', '3p', '9c', '4k', '6c', '9b'],
    ['Qc', '', '', '', '', '', '', '10b'],
    ['Jp', '', '', '', '', '', '', ''],
    ['10b', '', '', '', '', '', '', ''],
    ['9k', '', '', '', '', '', '', ''],
    ['8b', '', '', '', '', '', '', ''],
    ['7p', '', '', '', '', '', '', ''],
    ['6b', '', '', '', '', '', '', ''],
    ['5p', '', '', '', '', '', '', ''],
    ['4b', '', '', '', '', '', '', ''],
    ['3p', '', '', '', '', '', '', ''],
    ['2b', '', '', '', '', '', '', ''],
];
export const filledBoard = [filledZeroLevel, ...freeBoard.slice(1)] as Board;
export const freePosition: Position = [1, 1];
