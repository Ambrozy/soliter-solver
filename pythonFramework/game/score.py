import math

from .constants import HEARTS_INDEX, CROSSES_INDEX, SPADES_INDEX, DIAMONDS_INDEX, EMPTY
from .game_ends import isLose
from .utils import toCardNumber, getStackPossibleLength, getAt, isCompatible


def sumSeries(n):
    return round((n * (n + 1)) / 2)


def getBinScore(board):
    return (sumSeries(toCardNumber(board[0][HEARTS_INDEX])) +
            sumSeries(toCardNumber(board[0][CROSSES_INDEX])) +
            sumSeries(toCardNumber(board[0][SPADES_INDEX])) +
            sumSeries(toCardNumber(board[0][DIAMONDS_INDEX])))


def getBoardScore(board):
    stackPossibleLength = getStackPossibleLength(board)
    binScore = getBinScore(board)
    layoutScore = 0

    for column in range(len(board[0])):
        stackLength = 0
        lastCard = getAt(board, [-1, column])
        for level in range(len(board) - 2, 0, -1):
            card = getAt(board, [level, column])

            if card != EMPTY and isCompatible(card, lastCard):
                stackLength += 1
            else:
                layoutScore += sumSeries(stackLength)
                stackLength = 0
            lastCard = card
        layoutScore += sumSeries(stackLength)

    return stackPossibleLength + binScore + layoutScore


def getBoardReward(board, nextBoard):
    if isLose(nextBoard):
        return -1

    currentBinScore = getBinScore(board)
    nextBinScore = getBinScore(nextBoard)

    return int(currentBinScore != nextBinScore)


def getBoardExtReward(board, nextBoard):
    if isLose(nextBoard):
        return -1

    score = getBoardScore(board)
    nextScore = getBoardScore(nextBoard)
    sign = math.copysign(1, nextScore - score)

    return sign * 0.1 + getBoardReward(board, nextBoard)
