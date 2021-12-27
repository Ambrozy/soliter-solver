import { flattenBoard, isBoardValid } from '../board';
import { randomBoard } from '../../game';

describe('flattenBoard', () => {
    it('should flatten 2d array', () => {
        const result = ['', '', '', '', 'Kk', 'Kp', 'Kc', 'Kb'];
        const board = [result.slice(0, 4), result.slice(4)];
        expect(flattenBoard(board)).toEqual(result);
    });
});

describe('isBoardValid', () => {
    it('should return true when check random board', () => {
        expect(isBoardValid(randomBoard())).toBe(true);
    });
    it('should return false when pass not array', () => {
        expect(isBoardValid('' as any)).toBe(false);
    });
    it('should return false when pass 1d array', () => {
        expect(isBoardValid(['', '', '', ''] as any)).toBe(false);
    });
    it('should return false when second direction is not 8', () => {
        expect(isBoardValid([['', '', '', '']] as any)).toBe(false);
    });
});
