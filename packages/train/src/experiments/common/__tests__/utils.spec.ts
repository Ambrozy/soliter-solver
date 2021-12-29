import {
    getFinalScore,
    getLastBinFromEpisode,
    positionToIndexMap,
    randomBinFromEpisode,
    removeIneffectiveSteps,
    toOhe,
} from '../utils';

Array.prototype.at = function (index: number) {
    return index >= 0 ? this[index] : this[this.length + index];
};

describe('utils', () => {
    describe('toOhe', () => {
        it('should return ohe', () => {
            expect(Array.from(toOhe(1, 4))).toEqual([0, 1, 0, 0]);
            expect(Array.from(toOhe(9, 10))).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 1]);
        });
        it('should return zeros when index out of range', () => {
            expect(Array.from(toOhe(4, 4))).toEqual([0, 0, 0, 0]);
            expect(Array.from(toOhe(5, 4))).toEqual([0, 0, 0, 0]);
        });
    });

    describe('removeIneffectiveSteps', () => {
        it('should remove steps that not affect on board', () => {
            const episode = [
                { board: 1, move: 1 },
                { board: 1, move: 2 },
                { board: 2, move: 3 },
                { board: 2, move: 4 },
                { board: 1, move: 5 },
                { board: 5, move: 6 },
                { board: 5, move: 7 },
                { board: 5, move: 8 },
                { board: 5, move: 9 },
            ] as any;
            expect(removeIneffectiveSteps(episode)).toEqual([
                { board: 1, move: 2 },
                { board: 2, move: 4 },
                { board: 1, move: 5 },
            ]);
        });
    });

    describe('getLastBinFromEpisode', () => {
        it('should return last bin', () => {
            const board = [['', '', '', '', 'Kk', 'Kp', 'Kc', 'Kb']];
            const episode = [{ board }] as any;
            expect(getLastBinFromEpisode(episode)).toEqual(['Kk', 'Kp', 'Kc', 'Kb']);
        });
    });

    describe('getFinalScore', () => {
        it('should return last score', () => {
            const episode = [{ score: 10 }, { score: 2 }, { score: 5 }] as any;
            expect(getFinalScore(episode)).toBe(5);
        });
    });

    describe('randomBinFromEpisode', () => {
        it('should return last bin and replace empty card to unknown', () => {
            const board = [['', '', '', '', 'Kk', '', '', 'Kb']];
            const episode = [{ board }] as any;

            jest.spyOn(global.Math, 'random').mockReturnValue(0.0);
            expect(randomBinFromEpisode(episode)).toEqual(['Kk', 'u', 'u', 'Kb']);
            jest.spyOn(global.Math, 'random').mockRestore();
        });

        it('should return last bin and replace empty card to unknown', () => {
            const board = [['', '', '', '', 'Kk', '', '', 'Kb']];
            const episode = [{ board }] as any;

            jest.spyOn(global.Math, 'random')
                .mockReturnValueOnce(0.0)
                .mockReturnValue(1.0);
            expect(randomBinFromEpisode(episode)).toEqual(['Kk', 'u', 'u', 'u']);
            jest.spyOn(global.Math, 'random').mockRestore();
        });

        it('should return last bin and not replace the last card', () => {
            const board = [['', '', '', '', 'Kk', '', 'Kc', 'Kb']];
            const episode = [{ board }] as any;

            jest.spyOn(global.Math, 'random').mockReturnValue(1.0);
            expect(randomBinFromEpisode(episode)).toEqual(['u', 'u', 'u', 'Kb']);
            jest.spyOn(global.Math, 'random').mockRestore();
        });
    });

    describe('moveToIndexMap', () => {
        it('should correct set indexes', () => {
            expect(Array.from(positionToIndexMap([0, 1]))).toEqual([
                0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0,
            ]);
            expect(Array.from(positionToIndexMap([5, 7]))).toEqual([
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0,
            ]);
        });
    });
});
