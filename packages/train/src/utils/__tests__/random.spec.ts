import {
    force,
    random,
    randomInteger,
    randomShuffle,
    sample,
    scoreToProbabilities,
    sum,
} from '../random';

describe('random utils', () => {
    describe('random', () => {
        it('should return correct number', () => {
            jest.spyOn(global.Math, 'random')
                .mockReturnValueOnce(0.0)
                .mockReturnValueOnce(0.2)
                .mockReturnValueOnce(0.99);

            expect(random(3, 10)).toBe(3);
            expect(random(3, 10)).toBe(4.4);
            expect(random(3, 10)).toBe(9.93);
            jest.spyOn(global.Math, 'random').mockRestore();
        });
    });

    describe('randomInteger', () => {
        it('should return correct number', () => {
            jest.spyOn(global.Math, 'random')
                .mockReturnValueOnce(0.0)
                .mockReturnValueOnce(0.2)
                .mockReturnValueOnce(0.99);

            expect(randomInteger(3, 10)).toBe(3);
            expect(randomInteger(3, 10)).toBe(4);
            expect(randomInteger(3, 10)).toBe(9);
            jest.spyOn(global.Math, 'random').mockRestore();
        });
    });

    describe('randomShuffle', () => {
        it('should shuffle array', () => {
            jest.spyOn(global.Math, 'random').mockReturnValue(0.0);

            expect(randomShuffle([3, 10])).toEqual([10, 3]);
            jest.spyOn(global.Math, 'random').mockRestore();
        });
    });

    describe('sum', () => {
        it('should return sum of numbers', () => {
            expect(sum([3, 10, 4, 9, 45])).toBe(71);
        });
        it('should return sum of numbers and do not count less threshold', () => {
            expect(sum([3, 10, 4, 9, 45], 5)).toBe(64);
            expect(sum([3, 10, 4, 9, 45], 10)).toBe(45);
        });
    });

    describe('scoreToProbabilities', () => {
        it('should return probabilities', () => {
            const probabilities = [0.05, 0.17, 0.14, 0.19, 0.45];
            expect(scoreToProbabilities([5, 17, 14, 19, 45])).toEqual(probabilities);
        });
        it('should return probabilities and do not count less threshold', () => {
            const probabilities = [0, 0.1875, 0.1625, 0.2125, 0.4375];
            const probabilities2 = [0, 0, 0, 0, 1];
            expect(scoreToProbabilities([5, 15, 13, 17, 35], 10)).toEqual(probabilities);
            expect(scoreToProbabilities([5, 17, 14, 19, 45], 20)).toEqual(probabilities2);
        });
    });

    describe('force', () => {
        it('should return index of maximum', () => {
            expect(force([0.05, 0.17, 0.14, 0.19, 0.45])).toEqual(4);
        });

        it('should return index of random maximum between the same values', () => {
            jest.spyOn(global.Math, 'random').mockReturnValue(0.99);
            expect(force([0.05, 0.17, 0.14, 0.19, 0.45, 0.45])).toEqual(5);
            jest.spyOn(global.Math, 'random').mockRestore();
        });
    });

    describe('sample', () => {
        it('should return index of one sample', () => {
            jest.spyOn(global.Math, 'random').mockReturnValue(0.5);

            expect(sample([0.05, 0.17, 0.14, 0.19, 0.45])).toEqual(3);
            jest.spyOn(global.Math, 'random').mockRestore();
        });
    });
});
