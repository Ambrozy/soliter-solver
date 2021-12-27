import { isBinReached, isLose, isWinBin } from '../gameEnds';
import { UNKNOWN_CARD } from '../types';

String.prototype.at = function (index: number) {
    return index >= 0 ? this[index] : this[this.length + index];
};

describe('gameEnds', () => {
    describe('isWinBin', () => {
        it('should return true if bin filled', () => {
            expect(isWinBin([['', '', '', '', 'Kc', 'Kk', 'Kp', 'Kb']])).toBe(true);
        });
        it('should return false if bin not filled', () => {
            expect(isWinBin([['', '', '', '', 'Ac', 'Kk', 'Kp', 'Kb']])).toBe(false);
        });
    });

    describe('isLose', () => {
        describe('negative cases', () => {
            it('should return false when has empty place', () => {
                const board = [
                    ['2c', '', '2p', '2b', '3c', '3k', '3p', '3b'],
                    ['4c', '10k', '10p', '10b', 'Jc', 'Jk', 'Jp', 'Jb'],
                    ['3p', 'Qk', 'Qp', 'Qb', 'Kc', 'Kk', 'Kp', 'Kb'],
                    ['2c', 'Qk', 'Qp', 'Qb', '9c', '9k', '9p', '9b'],
                    ['', '', '', '', '', '', '', ''],
                ];
                expect(isLose(board)).toBe(false);
            });
            it('should return false when has empty column', () => {
                const board = [
                    ['2c', '2k', '2p', '2b', '3c', '3k', '3p', '3b'],
                    ['4c', '', '10p', '10b', 'Jc', 'Jk', 'Jp', 'Jb'],
                    ['3p', '', 'Qp', 'Qb', 'Kc', 'Kk', 'Kp', 'Kb'],
                    ['2c', '', 'Qp', 'Qb', '9c', '9k', '9p', '9b'],
                    ['', '', '', '', '', '', '', ''],
                ];
                expect(isLose(board)).toBe(false);
            });
            it('should return false when has move to bin', () => {
                const board = [
                    ['2c', '2k', '2p', '2b', '3c', '3k', '3p', '3b'],
                    ['4c', '10k', '10p', '10b', 'Jc', 'Jk', 'Jp', 'Jb'],
                    ['3p', 'Qk', 'Qp', 'Qb', 'Kc', 'Kk', 'Kp', 'Kb'],
                    ['2c', '4k', 'Qp', 'Qb', '9c', '9k', '9p', '9b'],
                    ['', '', '', '', '', '', '', ''],
                ];
                expect(isLose(board)).toBe(false);
            });
            it('should return false when has move to column', () => {
                const board = [
                    ['2c', '2k', '2p', '2b', '3c', '3k', '3p', '3b'],
                    ['4c', '10k', '10p', '10b', 'Jc', 'Jk', 'Jp', 'Jb'],
                    ['3p', 'Qk', 'Qp', 'Qb', 'Kc', 'Kk', 'Kp', 'Kb'],
                    ['2c', 'Ak', 'Qp', 'Qb', '9c', '9k', '9p', '9b'],
                    ['', '', '', '', '', '', '', ''],
                ];
                expect(isLose(board)).toBe(false);
            });
            it('should return false when can move stack to column', () => {
                const board = [
                    ['', '', '', '', '3c', '3k', '3p', '3b'],
                    ['4c', '5k', '10p', '10b', 'Jc', 'Jk', 'Jp', 'Jb'],
                    ['3p', '', 'Qp', 'Qb', 'Kc', 'Kk', 'Kp', 'Kb'],
                    ['2c', '', 'Qp', 'Qb', '9c', '9k', '9p', '9b'],
                    ['', '', '', '', '', '', '', ''],
                ];
                expect(isLose(board)).toBe(false);
            });
        });
        describe('positive cases', () => {
            it('should return true when no moves left', () => {
                const board = [
                    ['2c', '2k', '2p', '2b', '3c', '3k', '3p', '3b'],
                    ['4c', '10k', '10p', '10b', 'Jc', 'Jk', 'Jp', 'Jb'],
                    ['3p', 'Qk', 'Qp', 'Qb', 'Kc', 'Kk', 'Kp', 'Kb'],
                    ['2c', 'Qk', 'Qp', 'Qb', '9c', '9k', '9p', '9b'],
                    ['', '', '', '', '', '', '', ''],
                ];
                expect(isLose(board)).toBe(true);
            });
        });
    });

    describe('isBinReached', () => {
        const board = [['', '', '', '', 'Qc', 'Qk', 'Jp', '9b']];
        it('should return true when bin reached', () => {
            expect(isBinReached(board, ['Qc', 'Qk', 'Jp', '9b'])).toBe(true);
            expect(isBinReached(board, ['9b', 'Qc', UNKNOWN_CARD, 'Jp'])).toBe(true);
            expect(isBinReached(board, ['Kc', 'Kk', 'Kp', 'Kb'])).toBe(true);
            expect(isBinReached(board, [UNKNOWN_CARD, 'Kp', 'Kk', 'Kb'])).toBe(true);
            expect(isBinReached(board, ['Kp', UNKNOWN_CARD, UNKNOWN_CARD, 'Kb'])).toBe(
                true,
            );
            expect(
                isBinReached(board, [UNKNOWN_CARD, UNKNOWN_CARD, 'Kp', UNKNOWN_CARD]),
            ).toBe(true);
            expect(
                isBinReached(board, [
                    UNKNOWN_CARD,
                    UNKNOWN_CARD,
                    UNKNOWN_CARD,
                    UNKNOWN_CARD,
                ]),
            ).toBe(true);
        });

        it('should return false when bin does not reached', () => {
            expect(isBinReached(board, ['Jc', 'Kk', 'Kp', 'Kb'])).toBe(false);
            expect(isBinReached(board, [UNKNOWN_CARD, '2p', 'Kk', 'Kb'])).toBe(false);
            expect(isBinReached(board, ['Kp', UNKNOWN_CARD, UNKNOWN_CARD, '6b'])).toBe(
                false,
            );
            expect(
                isBinReached(board, [UNKNOWN_CARD, UNKNOWN_CARD, '10p', UNKNOWN_CARD]),
            ).toBe(false);
        });
    });
});
