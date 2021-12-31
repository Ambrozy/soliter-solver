import { getBinScore, getBoardReward, getBoardScore } from '../score';
import { copyBoard } from '../utils';

const mockBoard = [
    ['', '', '', '', 'Ac', 'Ak', 'Ap', 'Ab'],
    ['2c', '2k', '2p', '2b', '3c', '3k', '3p', '3b'],
    ['4c', '4k', '4p', '4b', '5c', '5k', '5p', '5b'],
    ['6c', '6k', '6p', '6b', '7c', '7k', '7p', '7b'],
    ['8c', '8k', '8p', '8b', '9c', '9k', '9p', '9b'],
    ['10c', '10k', '10p', '10b', 'Jc', 'Jk', 'Jp', 'Jb'],
    ['Qc', 'Qk', 'Qp', 'Qb', 'Kc', 'Kk', 'Kp', 'Kb'],
];

String.prototype.at = function (index: number) {
    return index >= 0 ? this[index] : this[this.length + index];
};
Array.prototype.at = function (index: number) {
    return index >= 0 ? this[index] : this[this.length + index];
};

describe('score utils', () => {
    describe('getBinScore', () => {
        it('should return score', () => {
            expect(getBinScore(mockBoard)).toBe(4);
        });
    });

    describe('getBoardScore', () => {
        it('should return score', () => {
            expect(getBoardScore(mockBoard)).toBe(9);
        });
    });

    describe('getBoardReward', () => {
        it('should return +1 when bin changed', () => {
            const nextBoard = copyBoard(mockBoard);
            nextBoard[0][4] = '2c';
            expect(getBoardReward(mockBoard, nextBoard)).toBe(1);
        });
        it('should return -1 when lose', () => {
            const nextBoard = [
                ['Qc', 'Qk', 'Qp', 'Qb', 'Ac', 'Ak', 'Ap', 'Ab'],
                ['2c', '2k', '2p', '2b', '3c', '3k', '3p', '3b'],
                ['4c', '4k', '4p', '4b', '5c', '5k', '5p', '5b'],
                ['6c', '6k', '6p', '6b', '7c', '7k', '7p', '7b'],
                ['Kc', 'Kk', 'Kp', 'Kb', '9c', '9k', '9p', '9b'],
                ['10c', '10k', '10p', '10b', 'Jc', 'Jk', 'Jp', 'Jb'],
                ['', '', '', '', '8c', '8k', '8p', '8b'],
            ];
            expect(getBoardReward(mockBoard, nextBoard)).toBe(-1);
        });
    });
});
