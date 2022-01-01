from .constants import BIN_INDEXES, EMPTY
from .utils import getStackPossibleLength, getCardStackLength, getAt, setAt, isCompatibleBin, isCompatible, copyBoard


def isBinPosition(position):
    return position[0] == 0 and position[1] in BIN_INDEXES


def isMoveBlockedCard(board, from_position, to):
    maxStackLength = getStackPossibleLength(board, to[0] == 1)
    stackLength = getCardStackLength(board, from_position)
    return stackLength == 0 or stackLength > maxStackLength


def swapCards(board, from_position, to):
    moveCard = getAt(board, from_position)

    setAt(board, from_position, EMPTY)
    setAt(board, to, moveCard)


def nextState(board, move):
    [from_position, to] = move
    isToPlaceOrBin = to[0] == 0

    def isMoveFromBin():
        return isBinPosition(from_position)

    def isMoveToFilledPlace():
        return not isBinPosition(to) and getAt(board, to) != EMPTY

    def isMoveNothing():
        return getAt(board, from_position) == EMPTY

    def isMoveToSelf():
        return from_position[0] == to[0] and from_position[1] == to[1]

    def isMoveToWrongBin():
        return isBinPosition(to) and not isCompatibleBin(getAt(board, to), getAt(board, from_position))

    def isMoveToWrongColumn():
        return to[0] > 1 and not isCompatible(getAt(board, [to[0] - 1, to[1]]), getAt(board, from_position))

    def isMoveToNotLastColumnCard():
        return to[0] > 1 and getAt(board, [to[0] - 1, to[1]]) == EMPTY

    def isMoveStackToPlaceOrBin():
        from_card = getAt(board, [from_position[0] + 1, from_position[1]])
        return isToPlaceOrBin and from_position[0] > 0 and from_card != EMPTY

    if (
            isMoveFromBin() or
            isMoveToFilledPlace() or
            isMoveNothing() or
            isMoveToSelf() or
            isMoveToWrongBin() or
            isMoveToWrongColumn() or
            isMoveToNotLastColumnCard() or
            isMoveStackToPlaceOrBin()
    ):
        return board

    nextBoard = copyBoard(board)

    # card to place or bin
    if isToPlaceOrBin:
        swapCards(nextBoard, from_position, to)
        return nextBoard

    # card from place to column
    if from_position[0] == 0:
        previousPosition = [to[0] - 1, to[1]]
        if (
                to[0] == 1 or
                isCompatible(getAt(board, previousPosition), getAt(board, from_position))
        ):
            swapCards(nextBoard, from_position, to)
            return nextBoard

        return board

    # card from column to column
    if isMoveBlockedCard(board, from_position, to):
        return board

    currentFromPosition = from_position.copy()
    currentToPosition = to.copy()
    currentCard = getAt(nextBoard, currentFromPosition)

    while currentCard != EMPTY:
        setAt(nextBoard, currentFromPosition, EMPTY)
        setAt(nextBoard, currentToPosition, currentCard)

        currentFromPosition[0] += 1
        currentToPosition[0] += 1
        currentCard = getAt(nextBoard, currentFromPosition)

    return nextBoard
