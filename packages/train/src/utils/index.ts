export const random = (min: number, max: number) => min + Math.random() * (max - min);
export const randomInteger = (min: number, max: number) => Math.floor(random(min, max));
export const randomShuffle = <T extends object>(a: T[]) =>
    a.sort(() => randomInteger(-1, 2));
export const sum = (array: number[]) => array.reduce((result, next) => result + next, 0);
export const scoreToProbabilities = (scores: number[]) => {
    const sumScore = sum(scores);
    return scores.map((score) => score / sumScore);
};
export const force = (probabilities: number[]) => {
    let maximum = 0;
    let indexOfMaximum = 0;

    probabilities.forEach((probability, index) => {
        if (probability > maximum) {
            maximum = probability;
            indexOfMaximum = index;
        }
    });

    return indexOfMaximum;
};
export const sample = (probabilities: number[]) => {
    const roll = Math.random();
    let sumProbability = 0;

    for (let i = 0; i < probabilities.length; i++) {
        sumProbability += probabilities[i];

        if (sumProbability >= roll) {
            return i;
        }
    }

    return force(probabilities);
};

export const asyncLoop = <T extends object>(
    start: number,
    end: number,
    loopFunction: (index: number) => Promise<T | void>,
) => {
    const sign = Math.sign(end - start);
    const result: T[] = [];
    let iteration = start;

    const loop = (resolve: (value: T[]) => void) => {
        setTimeout(async () => {
            if (sign > 0 ? iteration < end : iteration > end) {
                try {
                    const iterationResult = await loopFunction(iteration);
                    if (iterationResult) {
                        result.push(iterationResult);
                    }
                } catch (_) {
                    resolve(result);
                }

                iteration += sign;
                loop(resolve);
            } else {
                resolve(result);
            }
        }, 0);
    };

    // eslint-disable-next-line compat/compat
    return new Promise<T[]>((resolve) => {
        loop(resolve);
    });
};
