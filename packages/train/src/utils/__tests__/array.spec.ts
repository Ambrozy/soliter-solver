import { array1d, array2d, range } from '../array';

describe('array utils', () => {
    describe('range', () => {
        it('should return keys', () => {
            expect([...range(5)]).toEqual([0, 1, 2, 3, 4]);
        });
    });

    describe('array1d', () => {
        it('should return 1d array', () => {
            expect(array1d(2, '')).toEqual(['', '']);
        });
    });

    describe('array2d', () => {
        it('should return 2d array', () => {
            expect(array2d([2, 2], '')).toEqual([
                ['', ''],
                ['', ''],
            ]);
        });
    });
});
