import { getBoardScore } from '../score';

const mockBoard = [
    ['', '', '', '', 'Ac', 'Ak', 'Ap', 'Ab'],
    ['2c', '2k', '2p', '2b', '3c', '3k', '3p', '3b'],
    ['4c', '4k', '4p', '4b', '5c', '5k', '5p', '5b'],
    ['6c', '6k', '6p', '6b', '7c', '7k', '7p', '7b'],
    ['8c', '8k', '8p', '8b', '9c', '9k', '9p', '9b'],
    ['10c', '10k', '10p', '10b', 'Jc', 'Jk', 'Jp', 'Jb'],
    ['Qc', 'Qk', 'Qp', 'Qb', 'Kc', 'Kk', 'Kp', 'Kb'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
];

String.prototype.at = function (index: number) {
    return index >= 0 ? this[index] : this[this.length + index];
};
Array.prototype.at = function (index: number) {
    return index >= 0 ? this[index] : this[this.length + index];
};

describe('getBoardScore', () => {
    it('should return score', () => {
        expect(getBoardScore(mockBoard)).toBe(13);
    });
});
