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
