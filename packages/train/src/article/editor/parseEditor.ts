import { isValidCard, randomBoard, UNKNOWN_CARD } from '../../game';
import { isBoardValid } from '../../utils/board';

export const parseEditor = async () => {
    const binLayout = document.querySelector('#bin-input') as HTMLInputElement;
    const boardLayout = document.querySelector('#board-input') as HTMLInputElement;

    let expectedBin = ['Kk', 'Kp', 'Kc', 'u'];
    let board = randomBoard();

    try {
        expectedBin = JSON.parse(binLayout.value);
        board = JSON.parse(boardLayout.value);
    } catch (_) {
        return Promise.reject(
            'Error: Board or expected bin is not readable. Check the syntax',
        );
    }

    if (
        !Array.isArray(expectedBin) ||
        expectedBin.length !== 4 ||
        expectedBin.some((card) => !isValidCard(card) && card !== UNKNOWN_CARD)
    ) {
        return Promise.reject(
            'Error: Expected bin is not correct. It should be array of 4 cards',
        );
    }

    if (!isBoardValid(board)) {
        return Promise.reject(
            'Error: Start board is not correct. It should be 2d array of cards',
        );
    }

    return Promise.resolve({
        expectedBin,
        board,
    });
};
