import {
    Bin,
    BIN_INDEXES,
    Board,
    CROSSES_INDEX,
    DIAMONDS_INDEX,
    HEARTS_INDEX,
    PLACE_INDEXES,
    SPADES_INDEX,
    UNKNOWN_CARD,
} from './types';
import {
    getAt,
    getLastCards,
    getStackPossibleLength,
    getSuite,
    isCompatible,
    isCompatibleBin,
    toCardNumber,
} from './utils';

export const hasMoves = (board: Board): boolean => {
    const maxStackLength = getStackPossibleLength(board);
    // has move to place or empty column
    if (maxStackLength > 1) {
        return true;
    }

    const [lastCards, lastIndexes] = getLastCards(board);

    // card
    const hasMoveToBin = (card: string) =>
        BIN_INDEXES.some((binIndex) =>
            isCompatibleBin(getAt(board, [0, binIndex]), card),
        );
    const hasMoveToColumn = (card: string, excludeColumnIndex?: number) =>
        lastCards.some(
            (lastCard, columnIndex) =>
                columnIndex !== excludeColumnIndex && isCompatible(lastCard, card),
        );
    const hasMoveFromPlace = () =>
        PLACE_INDEXES.some((placeIndex) => {
            const placeCard = getAt(board, [0, placeIndex]);
            return hasMoveToBin(placeCard) || hasMoveToColumn(placeCard);
        });
    const hasMoveCardFromColumn = () =>
        lastCards.some(
            (lastCard, columnIndex) =>
                hasMoveToBin(lastCard) || hasMoveToColumn(lastCard, columnIndex),
        );

    if (hasMoveFromPlace() || hasMoveCardFromColumn()) {
        return true;
    }

    // stack
    return lastIndexes.some((lastIndex, columnIndex) => {
        let stackLength = 1;
        let currentLevelIndex = lastIndex;
        let currentCard = getAt(board, [currentLevelIndex, columnIndex]);
        let previousCard;

        while (currentCard && maxStackLength <= stackLength && currentLevelIndex >= 1) {
            if (previousCard && !isCompatible(currentCard, previousCard)) {
                break;
            }
            if (hasMoveToColumn(currentCard, columnIndex)) {
                return true;
            }

            stackLength += 1;
            currentLevelIndex -= 1;
            previousCard = currentCard;
            currentCard = getAt(board, [currentLevelIndex, columnIndex]);
        }
    });
};

export const isWinBin = (board: Board): boolean =>
    toCardNumber(board[0][HEARTS_INDEX]) === 13 &&
    toCardNumber(board[0][CROSSES_INDEX]) === 13 &&
    toCardNumber(board[0][SPADES_INDEX]) === 13 &&
    toCardNumber(board[0][DIAMONDS_INDEX]) === 13;

export const isBinReached = (board: Board, expectedBin: Bin): boolean => {
    const binCards = [
        board[0][HEARTS_INDEX],
        board[0][CROSSES_INDEX],
        board[0][SPADES_INDEX],
        board[0][DIAMONDS_INDEX],
    ];
    const binDescription = binCards.map((binCard) => ({
        suite: getSuite(binCard),
        number: toCardNumber(binCard),
    }));
    const expectedCards = expectedBin.filter((card) => card !== UNKNOWN_CARD);

    return (
        expectedCards.length === 0 ||
        expectedCards.every((expectedCard) =>
            binDescription.some(
                (cardDescription) =>
                    getSuite(expectedCard) === cardDescription.suite &&
                    toCardNumber(expectedCard) >= cardDescription.number,
            ),
        )
    );
};

export const isWin = (board: Board, expectedBin: Bin): boolean =>
    isWinBin(board) || isBinReached(board, expectedBin);

export const isLose = (board: Board): boolean => !hasMoves(board);
