import { possibleMoves } from '../possibleMoves';
import { Board } from '../types';
import { filledZeroLevel } from './board.mock';
import { nextState } from '../nextState';

String.prototype.at = function (index: number) {
    return index >= 0 ? this[index] : this[this.length + index];
};

const board = [
    ['', '', '', 'Ak', '', '', '', ''],
    ['Ab', '', 'Qc', 'Jp', '9c', '8b', '10p', '7p'],
    ['8p', '', '8k', 'Jk', '10c', 'Qp', 'Ak', 'Qb'],
    ['Ac', '', 'Kk', '5p', '5k', '4b', 'Kb', '6p'],
    ['7k', '', '8c', '10k', '4c', '2b', '3k', '7b'],
    ['Jk', '', '3b', '5b', 'Qk', '6k', '6b', '5c'],
    ['10b', '', '9p', '3c', 'Jb', 'Ap', '6c', '4b'],
    ['9k', '', 'Qb', '2c', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
];
const filledBoard = [filledZeroLevel, ...board.slice(1)] as Board;

describe('possibleMoves', () => {
    let moves = possibleMoves(board);
    moves.forEach((move) => {
        it(`should return correct moves for board with places. Move ${move}`, () => {
            const nextBoard = nextState(board, move);
            expect(nextBoard !== board).toBe(true);
        });
    });

    moves = possibleMoves(filledBoard);
    moves.forEach((move) => {
        it(`should return correct moves for board without places. Move ${move}`, () => {
            const nextBoard = nextState(filledBoard, move);
            expect(nextBoard !== filledBoard).toBe(true);
        });
    });
});
