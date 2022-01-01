from .constants import BIN_INDEXES, HEARTS, DIAMONDS, NONE_MOVE, PLACE_INDEXES, EMPTY, DECK
from copy import deepcopy


def getSuite(card):
    if len(card):
        return card[-1]
    return EMPTY


def toCardNumber(card):
    if not card:
        return 0

    card_value_map = {'1': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 1}
    card_value = card[0]

    return card_value_map[card_value] if card_value in card_value_map else int(card_value)


def isRed(card):
    return getSuite(card) in [HEARTS, DIAMONDS]


def isCompatible(bottom_card, top_card):
    return bottom_card == EMPTY or (
            isRed(bottom_card) != isRed(top_card) and
            toCardNumber(bottom_card) - toCardNumber(top_card) == 1
    )


def isCompatibleBin(bin_card, card):
    return (bin_card == EMPTY and toCardNumber(card) == 1) or (
            getSuite(bin_card) == getSuite(card) and
            toCardNumber(card) - toCardNumber(bin_card) == 1
    )


def getAt(board, position):
    try:
        return board[position[0]][position[1]]
    except:
        return EMPTY


def setAt(board, position, value):
    try:
        board[position[0]][position[1]] = value
    except:
        pass
    finally:
        pass


def getLastCards(board):
    cards = list()
    indexes = list()

    for columnIndex in range(0, len(board[0])):
        for levelIndex in range(1, len(board) + 1):
            currentCard = getAt(board, [levelIndex, columnIndex])
            if currentCard == EMPTY:
                previousLevel = max(levelIndex - 1, 1)
                cards.append(getAt(board, [previousLevel, columnIndex]))
                indexes.append(previousLevel)
                break

    return [cards, indexes]


def getLeftSpace(board):
    return len(list(filter(lambda index: getAt(board, [0, index]) == EMPTY, PLACE_INDEXES)))


def getStackPossibleLength(board, toEmptyColumn=False):
    leftSpace = getLeftSpace(board)
    emptyColumns = len(list(filter(lambda card: card == EMPTY, board[1])))

    return (leftSpace + 1) * (1 + emptyColumns - int(toEmptyColumn))


def copyBoard(board):
    return deepcopy(board)


def isValidCard(card):
    return card == EMPTY or card in DECK


def getCardStackLength(board, fromPosition):
    currentPosition = fromPosition.copy()
    currentCard = getAt(board, currentPosition)
    previousCard = None
    stackLength = 0

    while currentCard:
        if previousCard is not None and not isCompatible(previousCard, currentCard):
            return 0

        currentPosition[0] += 1
        stackLength += 1
        previousCard = currentCard
        currentCard = getAt(board, currentPosition)

    return stackLength


def moveToString(board, move):
    if move == NONE_MOVE:
        return NONE_MOVE

    [fromPosition, to] = move
    fromString = board[fromPosition[0]][fromPosition[1]];

    isToPlace = to[0] == 0 and to[1] in PLACE_INDEXES
    isToBin = to[0] == 0 and to[1] in BIN_INDEXES

    toString = None
    if isToPlace:
        toString = 'place'
    elif isToBin:
        toString = 'bin'
    else:
        toString = board[max(1, to[0] - 1)][to[1]]

    if toString is None:
        toString = "''"

    return f'{fromString} {toString}'
