import {
    Board,
    getLastCards,
    getStackPossibleLength,
    isCompatible,
    toCardNumber,
} from '../game';

const sumSeries = (n: number) => Math.round((n * (n + 1)) / 2);

export const getBoardScore = (board: Board) => {
    const [lastCards, lastIndexes] = getLastCards(board.layout);
    const stackPossibleLength = getStackPossibleLength(board.place, lastCards);
    const binScore =
        sumSeries(toCardNumber(board.bin.c)) +
        sumSeries(toCardNumber(board.bin.k)) +
        sumSeries(toCardNumber(board.bin.b)) +
        sumSeries(toCardNumber(board.bin.p));
    let layoutScore = 0;

    board.layout.forEach((column, index) => {
        let stackLength = 0;
        let lastCard = lastCards[index];
        for (let i = lastIndexes[index] - 1; i >= 0; i--) {
            const card = column[i];
            if (card && isCompatible(card, lastCard)) {
                stackLength++;
            } else {
                layoutScore += sumSeries(stackLength);
                stackLength = 0;
            }
            lastCard = card;
        }
        layoutScore += sumSeries(stackLength);
    });

    return stackPossibleLength + 2 * binScore + layoutScore;
};
