import { force } from '../../utils';
import { predictionToPosition } from '../processOneMove';

describe('predictionToPosition', () => {
    it('should return correct index', () => {
        const indexMap = [
            0, 0, 0, 0, 0, 0, 0, 0, // 8
            0, 0, 0, 0, 1, 0, 0, 0 // 16
        ];
        expect(predictionToPosition(indexMap, force)).toEqual([1, 4]);
    });
});
