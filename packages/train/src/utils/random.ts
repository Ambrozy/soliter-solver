export const random = (min: number, max: number) => min + Math.random() * (max - min);
export const randomInteger = (min: number, max: number) => Math.floor(random(min, max));
export const randomShuffle = <T>(a: T[]) => a.sort(() => randomInteger(-1, 2));
export const sum = (array: number[], threshold = 0) =>
    array.reduce((result, next) => (next > threshold ? result + next : result), 0);
export const scoreToProbabilities = (scores: number[], threshold = 0) => {
    const sumScore = sum(scores, threshold);
    return scores.map((score) => (score > threshold ? score / sumScore : 0));
};
export const force = (probabilities: number[]) => {
    const maximum = Math.max(...probabilities);
    const theSameProbabilityIndexes = probabilities.reduce(
        (indexes, probability, currentIndex) => {
            if (probability >= maximum) {
                indexes.push(currentIndex);
            }
            return indexes;
        },
        [],
    );
    const randomIndex = randomInteger(0, theSameProbabilityIndexes.length);

    return theSameProbabilityIndexes[randomIndex];
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
