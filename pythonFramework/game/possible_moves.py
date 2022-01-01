from .constants import EMPTY, BIN_INDEXES, PLACE_INDEXES
from .utils import isCompatible, getLastCards, getStackPossibleLength, getAt, getCardStackLength


def getCompatibleColumnIndexes(
        card,
        lastCards,
        excludeColumnIndex
):
    indexes = list()

    for (columnIndex, lastCard) in enumerate(lastCards):
        if isCompatible(lastCard, card) and columnIndex != excludeColumnIndex:
            indexes.append(columnIndex)

    return indexes


def possibleMoves(board):
    [lastCards, lastIndexes] = getLastCards(board)
    maxStackLength = getStackPossibleLength(board)
    maxEmptyColumnStackLength = getStackPossibleLength(board, True)
    moves = list()

    def getToLayoutMoves(card, fromPosition, stackLength):
        column = fromPosition[1]
        indexes = getCompatibleColumnIndexes(card, lastCards, column)

        def map_func(columnIndex):
            toLevel = lastIndexes[columnIndex]
            return [1 if toLevel == 1 else toLevel + 1, columnIndex]

        def filter_func(to):
            return (to[0] == 1 and stackLength <= maxEmptyColumnStackLength) or (
                    to[0] > 1 and stackLength <= maxStackLength)

        def to_move(to):
            return [fromPosition, to]

        return list(map(to_move, filter(filter_func, map(map_func, indexes))))

    def getToBinMoves(card, fromPosition):
        def filter_func(columnIndex):
            return getAt(board, [0, columnIndex]) == card

        def to_move(columnIndex):
            return [fromPosition, [0, columnIndex]]

        return list(map(to_move, filter(filter_func, BIN_INDEXES)))

    def getToPlaceMoves(fromPosition):
        def filter_func(columnIndex):
            return getAt(board, [0, columnIndex]) == EMPTY

        def to_move(columnIndex):
            return [fromPosition, [0, columnIndex]]

        return list(map(to_move, filter(filter_func, PLACE_INDEXES)))

    # from layout
    for column in range(len(board[0])):
        for level in range(1, len(board)):
            fromPosition = [level, column]
            card = getAt(board, fromPosition)
            stackLength = getCardStackLength(board, fromPosition)

            if stackLength > 0:
                # to layout
                moves.extend(getToLayoutMoves(card, fromPosition, stackLength))

            if stackLength == 1:
                # to place
                moves.extend(getToPlaceMoves(fromPosition))
                # to bin
                moves.extend(getToBinMoves(card, fromPosition))

    # from place
    for columnIndex in PLACE_INDEXES:
        fromPosition = [0, columnIndex]
        card = getAt(board, fromPosition)

        if card != EMPTY:
            # to layout
            moves.extend(getToLayoutMoves(card, fromPosition, 0))
            # to bin
            moves.extend(getToBinMoves(card, fromPosition))

    return moves
