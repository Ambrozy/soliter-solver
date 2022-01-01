from .constants import BIN_INDEXES, PLACE_INDEXES, EMPTY, HEARTS_INDEX, CROSSES_INDEX, SPADES_INDEX, DIAMONDS_INDEX, \
    UNKNOWN_CARD
from .utils import getStackPossibleLength, getLastCards, getAt, isCompatibleBin, isCompatible, toCardNumber, getSuite


def hasMoves(board):
    maxStackLength = getStackPossibleLength(board)
    # has move to place or empty column
    if maxStackLength > 1:
        return True

    [lastCards, lastIndexes] = getLastCards(board)

    # card
    def hasMoveToBin(card):
        return any(filter(lambda binIndex: isCompatibleBin(getAt(board, [0, binIndex]), card), BIN_INDEXES))

    def hasMoveToColumn(card, excludeColumnIndex=-1):
        def filterFunc(item):
            [columnIndex, lastCard] = item
            return columnIndex != excludeColumnIndex and isCompatible(lastCard, card)

        return any(filter(filterFunc, enumerate(lastCards)))

    def hasMoveFromPlace():
        def filterFunc(placeIndex):
            placeCard = getAt(board, [0, placeIndex])
            return hasMoveToBin(placeCard) or hasMoveToColumn(placeCard)

        return any(filter(filterFunc, PLACE_INDEXES))

    def hasMoveCardFromColumn():
        def filterFunc(item):
            [columnIndex, lastCard] = item
            return hasMoveToBin(lastCard) or hasMoveToColumn(lastCard, columnIndex)

        return any(filter(filterFunc, enumerate(lastCards)))

    if hasMoveFromPlace() or hasMoveCardFromColumn():
        return True

    # stack
    def filterFunc(item):
        [columnIndex, lastIndex] = item
        stackLength = 1
        currentLevelIndex = lastIndex
        currentCard = getAt(board, [currentLevelIndex, columnIndex])
        previousCard = None

        while currentCard is not EMPTY and maxStackLength <= stackLength and currentLevelIndex >= 1:
            if previousCard is not None and not isCompatible(currentCard, previousCard):
                break
            if hasMoveToColumn(currentCard, columnIndex):
                return True

            stackLength += 1
            currentLevelIndex -= 1
            previousCard = currentCard
            currentCard = getAt(board, [currentLevelIndex, columnIndex])

    return any(filter(filterFunc, enumerate(lastIndexes)))


def isWinBin(board):
    return (toCardNumber(board[0][HEARTS_INDEX]) == 13 and
            toCardNumber(board[0][CROSSES_INDEX]) == 13 and
            toCardNumber(board[0][SPADES_INDEX]) == 13 and
            toCardNumber(board[0][DIAMONDS_INDEX]) == 13)


def isBinReached(board, expectedBin):
    binCards = [
        board[0][HEARTS_INDEX],
        board[0][CROSSES_INDEX],
        board[0][SPADES_INDEX],
        board[0][DIAMONDS_INDEX],
    ]
    binDescription = list(map(lambda binCard: {'suite': getSuite(binCard), 'number': toCardNumber(binCard)}, binCards))
    expectedCards = list(filter(lambda card: card != UNKNOWN_CARD, expectedBin))

    def every_func(expectedCard):
        def some_func(cardDescription):
            return (getSuite(expectedCard) == cardDescription['suite'] and
                    toCardNumber(expectedCard) <= cardDescription['number'])

        return any(filter(some_func, binDescription))

    return len(expectedCards) == 0 or all([every_func(expectedCard) for expectedCard in expectedCards])


def isWin(board, expectedBin):
    return isWinBin(board) or isBinReached(board, expectedBin)


def isLose(board):
    return not hasMoves(board)
