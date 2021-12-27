import {
    getCardStackLength,
    getLastCards,
    getLeftSpace,
    getStackPossibleLength,
    getSuite,
    isCompatible,
    isCompatibleBin,
    isRed,
    toCardNumber,
} from '../utils';

String.prototype.at = function (index: number) {
    return index >= 0 ? this[index] : this[this.length + index];
};

describe('utils', () => {
    describe('getSuite', () => {
        it('should return last letter', () => {
            expect(getSuite('Kk')).toBe('k');
        });
    });

    describe('toCardNumber', () => {
        it('should return correct number', () => {
            expect(toCardNumber('Ak')).toBe(1);
            expect(toCardNumber('2c')).toBe(2);
            expect(toCardNumber('3c')).toBe(3);
            expect(toCardNumber('4c')).toBe(4);
            expect(toCardNumber('5c')).toBe(5);
            expect(toCardNumber('6c')).toBe(6);
            expect(toCardNumber('7c')).toBe(7);
            expect(toCardNumber('8c')).toBe(8);
            expect(toCardNumber('9c')).toBe(9);
            expect(toCardNumber('10c')).toBe(10);
            expect(toCardNumber('Jp')).toBe(11);
            expect(toCardNumber('Qc')).toBe(12);
            expect(toCardNumber('Kk')).toBe(13);
        });
    });

    describe('isRed', () => {
        it('should return true if suite is red', () => {
            expect(isRed('Ab')).toBe(true);
            expect(isRed('2c')).toBe(true);
        });
        it('should return false if suite is black', () => {
            expect(isRed('Ak')).toBe(false);
            expect(isRed('2p')).toBe(false);
        });
    });

    describe('isCompatible', () => {
        it('should return true if cards are compatible', () => {
            expect(isCompatible('2k', 'Ab')).toBe(true);
            expect(isCompatible('Kk', 'Qb')).toBe(true);
        });
        it('should return true if bottom card is empty card', () => {
            expect(isCompatible('', 'Ab')).toBe(true);
            expect(isCompatible('', 'Qb')).toBe(true);
        });
        it('should return false if cards are not compatible', () => {
            expect(isCompatible('Qb', 'Kk')).toBe(false);
            expect(isCompatible('2p', 'Jp')).toBe(false);
        });
    });

    describe('isCompatibleBin', () => {
        it('should return true if cards are compatible with bin', () => {
            expect(isCompatibleBin('2b', '3b')).toBe(true);
            expect(isCompatibleBin('5k', '6k')).toBe(true);
            expect(isCompatibleBin('Qc', 'Kc')).toBe(true);
            expect(isCompatibleBin('10p', 'Jp')).toBe(true);
        });
        it('should return true if bin card is empty card and only A', () => {
            expect(isCompatibleBin('', 'Ab')).toBe(true);
            expect(isCompatibleBin('', '6k')).toBe(false);
            expect(isCompatibleBin('', 'Kc')).toBe(false);
            expect(isCompatibleBin('', '2p')).toBe(false);
        });
        it('should return false if cards are not compatible with bin', () => {
            expect(isCompatibleBin('2b', '10b')).toBe(false);
            expect(isCompatibleBin('Kk', 'Ak')).toBe(false);
            expect(isCompatibleBin('Qc', 'Kp')).toBe(false);
            expect(isCompatibleBin('10p', 'Jk')).toBe(false);
        });
    });

    describe('getLeftSpace', () => {
        it('should return correct left space if place is free', () => {
            expect(getLeftSpace([['', '', '', '', '', '', '', '']])).toBe(4);
        });
        it('should return correct left space if place is full', () => {
            expect(getLeftSpace([['2b', '2b', '2b', '2b', '', '', '', '']])).toBe(0);
        });
    });

    describe('getStackPossibleLength', () => {
        it('should return correct max stack length when has free place and free columns', () => {
            const board = [
                ['', '', '', '', '', '', '', ''],
                ['2b', '2b', '2b', '2b', '2b', '2b', '', ''],
            ];
            expect(getStackPossibleLength(board)).toBe(15);
        });
        it('should return correct max stack length when has less place and free columns', () => {
            const board = [
                ['', '2b', '2b', '2b', '', '', '', ''],
                ['2b', '2b', '2b', '2b', '2b', '2b', '', ''],
            ];
            expect(getStackPossibleLength(board)).toBe(6);
        });
        it('should return correct max stack length when has no place and no free columns', () => {
            const board = [
                ['2b', '2b', '2b', '2b', '', '', '', ''],
                ['2b', '2b', '2b', '2b', '2b', '2b', '2b', '2b'],
            ];
            expect(getStackPossibleLength(board)).toBe(1);
        });
        it('should return correct max stack length when has free place, free columns and card goes to empty column', () => {
            const board = [
                ['', '', '', '', '', '', '', ''],
                ['2b', '2b', '2b', '2b', '2b', '2b', '', ''],
            ];
            expect(getStackPossibleLength(board, true)).toBe(10);
        });
        it('should return correct max stack length when card goes to last empty column', () => {
            const board = [
                ['2b', '2b', '2b', '2b', '', '', '', ''],
                ['2b', '2b', '2b', '2b', '2b', '2b', '2b', ''],
            ];
            expect(getStackPossibleLength(board, true)).toBe(1);
        });
    });

    describe('getLastCards', () => {
        it('should return correct arrays', () => {
            const board = [
                ['', '', '', '', '', '', '', ''],
                ['Kk', '', '2c', '3p', '9c', '4k', '6c', '9b'],
                ['Qc', '', '', '', '', '', '', '10b'],
                ['Jp', '', '', '', '', '', '', ''],
            ];
            expect(getLastCards(board)).toEqual([
                ['Jp', '', '2c', '3p', '9c', '4k', '6c', '10b'],
                [3, 1, 1, 1, 1, 1, 1, 2],
            ]);
        });
    });

    describe('getCardStackLength', () => {
        const board = [
            ['', '', '', '', '', '', '', ''],
            ['Kk', '', '2c', '3p', '9c', '4k', '6c', '9b'],
            ['Qc', '', '3k', '', '', '', '', '10b'],
            ['Jp', '', '10k', '', '', '', '', ''],
        ];
        it('should return correct stack length when stack', () => {
            expect(getCardStackLength(board, [1, 0])).toBe(3);
            expect(getCardStackLength(board, [2, 0])).toBe(2);
        });
        it('should return one when single card', () => {
            expect(getCardStackLength(board, [2, 7])).toBe(1);
        });
        it('should return zero when blocked stack', () => {
            expect(getCardStackLength(board, [1, 2])).toBe(0);
        });
        it('should return zero when empty space', () => {
            expect(getCardStackLength(board, [2, 1])).toBe(0);
        });
        it('should return zero when no card', () => {
            expect(getCardStackLength(board, [1, 1])).toBe(0);
        });
        it('should return zero when blocked card', () => {
            expect(getCardStackLength(board, [1, 7])).toBe(0);
        });
    });
});
