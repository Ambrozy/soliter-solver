import { nextState } from '../nextState';
import { Position } from '../types';
import { filledBoard, freeBoard, freePosition } from './board.mock';

String.prototype.at = function (index: number) {
    return index >= 0 ? this[index] : this[this.length + index];
};

describe('nextState', () => {
    describe('negative cases', () => {
        it('should return the same board when move from bin', () => {
            const from: Position = [0, 4];
            expect(nextState(filledBoard, [from, freePosition])).toBe(filledBoard);
        });

        it('should return the same board when move to filled place', () => {
            const from: Position = [1, 3]; // 3p
            const to: Position = [0, 0]; // 2c
            expect(nextState(filledBoard, [from, to])).toBe(filledBoard);
        });

        it('should return the same board when move nothing', () => {
            const to: Position = [2, 3]; // after 3p
            expect(nextState(filledBoard, [freePosition, to])).toBe(filledBoard);
        });

        it('should return the same board when move to self', () => {
            const to: Position = [1, 3]; // 3p
            expect(nextState(filledBoard, [to, to])).toBe(filledBoard);
        });

        it('should return the same board when move to wrong bin', () => {
            const from: Position = [1, 3]; // 3p
            const to: Position = [0, 6]; // 3p
            expect(nextState(filledBoard, [from, to])).toBe(filledBoard);
        });

        it('should return the same board when move to wrong column', () => {
            const from: Position = [1, 2]; // 2c
            const to: Position = [2, 4]; // after 9c
            expect(nextState(filledBoard, [from, to])).toBe(filledBoard);
        });

        it('should return the same board when move stack to place', () => {
            const from: Position = [2, 0]; // 3k, ...
            const to: Position = [0, 0]; // place
            expect(nextState(filledBoard, [from, to])).toBe(filledBoard);
        });

        it('should return the same board when move wrong stack to place', () => {
            const from: Position = [2, 7]; // 9b, 10b
            const to: Position = [0, 0]; // place
            expect(nextState(filledBoard, [from, to])).toBe(filledBoard);
        });

        it('should return the same board when move stack to bin', () => {
            const from: Position = [2, 0]; // Qc, ...
            const to: Position = [0, 4]; // bin
            expect(nextState(filledBoard, [from, to])).toBe(filledBoard);
        });

        it('should return the same board when move wrong stack to bin', () => {
            const from: Position = [2, 7]; // 9b, 10b
            const to: Position = [0, 4]; // bin
            expect(nextState(filledBoard, [from, to])).toBe(filledBoard);
        });

        it('should return the same board when move wrong stack', () => {
            const from: Position = [1, 7]; // 9b, 10b
            expect(nextState(filledBoard, [from, freePosition])).toBe(filledBoard);
        });

        it('should return the same board when move big stack', () => {
            const from: Position = [2, 0]; // Kk, ...
            expect(nextState(filledBoard, [from, freePosition])).toBe(filledBoard);
        });

        it('should return the same board when move big stack and empty place', () => {
            const from: Position = [2, 0]; // Kk, ...
            expect(nextState(freeBoard, [from, freePosition])).toBe(freeBoard);
        });

        it('should return the same board when move stack to wrong destination', () => {
            const from: Position = [9, 0]; // 5p, 4b, 3p, 2b
            const to: Position = [1, 2]; // 2c
            expect(nextState(freeBoard, [from, to])).toBe(freeBoard);
        });
    });

    describe('positive cases', () => {
        it('should return next board when move to empty bin', () => {
            const from: Position = [1, 2]; // 2c
            const to: Position = [0, 4]; // empty bin
            const expectedBoard = [
                ['', '', '', '', '2c', '', '', ''],
                ['Kk', '', '', '3p', '9c', '4k', '6c', '9b'],
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
            freeBoard[0][4] = 'Ac';
            expect(nextState(freeBoard, [from, to])).toEqual(expectedBoard);
            freeBoard[0][4] = '';
        });

        it('should return next board when move to empty place', () => {
            const from: Position = [1, 2]; // 2c
            const to: Position = [0, 0]; // empty place
            const expectedBoard = [
                ['2c', '', '', '', '', '', '', ''],
                ['Kk', '', '', '3p', '9c', '4k', '6c', '9b'],
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
            expect(nextState(freeBoard, [from, to])).toEqual(expectedBoard);
        });

        it('should return next board when move card to empty column', () => {
            const from: Position = [1, 2]; // 2c
            const expectedBoard = [
                ['', '', '', '', '', '', '', ''],
                ['Kk', '2c', '', '3p', '9c', '4k', '6c', '9b'],
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
            expect(nextState(freeBoard, [from, freePosition])).toEqual(expectedBoard);
        });

        it('should return next board when move stack to empty column', () => {
            const from: Position = [9, 0]; // 5p, 4b, 3p, 2b
            const expectedBoard = [
                ['', '', '', '', '', '', '', ''],
                ['Kk', '5p', '2c', '3p', '9c', '4k', '6c', '9b'],
                ['Qc', '4b', '', '', '', '', '', '10b'],
                ['Jp', '3p', '', '', '', '', '', ''],
                ['10b', '2b', '', '', '', '', '', ''],
                ['9k', '', '', '', '', '', '', ''],
                ['8b', '', '', '', '', '', '', ''],
                ['7p', '', '', '', '', '', '', ''],
                ['6b', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
            ];
            expect(nextState(freeBoard, [from, freePosition])).toEqual(expectedBoard);
        });

        it('should return next board when move from place to empty column', () => {
            const from: Position = [0, 0]; // 2c
            const expectedBoard = [
                ['', '2k', '2p', '2b', 'Jc', '3k', '3p', '3b'],
                ['Kk', '2c', '2c', '3p', '9c', '4k', '6c', '9b'],
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
            expect(nextState(filledBoard, [from, freePosition])).toEqual(expectedBoard);
        });

        it('should return next board when move from place to right column', () => {
            const from: Position = [0, 0]; // 2c
            const to: Position = [2, 3]; // after 3p
            const expectedBoard = [
                ['', '2k', '2p', '2b', 'Jc', '3k', '3p', '3b'],
                ['Kk', '', '2c', '3p', '9c', '4k', '6c', '9b'],
                ['Qc', '', '', '2c', '', '', '', '10b'],
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
            expect(nextState(filledBoard, [from, to])).toEqual(expectedBoard);
        });

        it('should return next board when move card to right column', () => {
            const from: Position = [1, 2]; // 2c
            const to: Position = [2, 3]; // after 3p
            const expectedBoard = [
                ['', '', '', '', '', '', '', ''],
                ['Kk', '', '', '3p', '9c', '4k', '6c', '9b'],
                ['Qc', '', '', '2c', '', '', '', '10b'],
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
            expect(nextState(freeBoard, [from, to])).toEqual(expectedBoard);
        });

        it('should return next board when move stack to right column', () => {
            const from: Position = [9, 0]; // 5p, 4b, 3p, 2b
            const to: Position = [2, 6]; // after 6c
            const expectedBoard = [
                ['', '', '', '', '', '', '', ''],
                ['Kk', '', '2c', '3p', '9c', '4k', '6c', '9b'],
                ['Qc', '', '', '', '', '', '5p', '10b'],
                ['Jp', '', '', '', '', '', '4b', ''],
                ['10b', '', '', '', '', '', '3p', ''],
                ['9k', '', '', '', '', '', '2b', ''],
                ['8b', '', '', '', '', '', '', ''],
                ['7p', '', '', '', '', '', '', ''],
                ['6b', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
            ];
            expect(nextState(freeBoard, [from, to])).toEqual(expectedBoard);
        });

        it('should return next board when move card to right bin', () => {
            const from: Position = [1, 5]; // 4k
            const to: Position = [0, 5]; // 3k
            const expectedBoard = [
                ['2c', '2k', '2p', '2b', 'Jc', '4k', '3p', '3b'],
                ['Kk', '', '2c', '3p', '9c', '', '6c', '9b'],
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
            expect(nextState(filledBoard, [from, to])).toEqual(expectedBoard);
        });
    });

    describe('special cases', () => {
        it('should work correctly', () => {
            const board = [
                ['', '', '', '', '', '', '', ''],
                ['Ab', 'Ap', 'Qc', 'Jp', '9c', '8b', '10p', '7p'],
                ['8p', 'Kc', '8k', 'Jk', '10c', 'Qp', 'Ak', 'Qb'],
                ['Ac', '7c', 'Kk', '5p', '5k', '4b', 'Kb', '6p'],
                ['7k', 'Kp', '8c', '10k', '4c', '2b', '3k', '7b'],
                ['9b', '2p', '3b', '5b', 'Qk', '6k', '6b', '5c'],
                ['4p', 'Jc', '9p', '3c', 'Jb', '3p', '6c', '10b'],
                ['9k', '4k', '2k', '2c', '', '', '', ''],
            ];
            const move3 = [
                [6, 5],
                [13, 7],
            ];
            const move4 = [
                [6, 5],
                [26, 13],
            ];
            expect(nextState(board, move3 as any)).toEqual(board);
            expect(nextState(board, move4 as any)).toEqual(board);
        });
    });
});
