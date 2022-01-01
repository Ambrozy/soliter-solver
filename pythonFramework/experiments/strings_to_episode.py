import json

from ..game.constants import CROSSES, CROSSES_INDEX, DIAMONDS, DIAMONDS_INDEX, EMPTY, HEARTS, HEARTS_INDEX, \
    PLACE_INDEXES, SPADES, SPADES_INDEX
from ..game.next_state import nextState
from ..game.score import getBoardScore, getBoardReward
from ..game.utils import getSuite, flattenBoard, isBoardValid


def getPlacePosition(board, card):
    for index in PLACE_INDEXES:
        if board[0][index] == EMPTY:
            return [0, index]

    raise Exception(f'Error: place cannot be reached for card {card}')


def getBinPosition(card):
    suiteToIndex = {
        HEARTS: HEARTS_INDEX,
        CROSSES: CROSSES_INDEX,
        SPADES: SPADES_INDEX,
        DIAMONDS: DIAMONDS_INDEX,
    }

    try:
        columnIndex = suiteToIndex[getSuite(card)]
        return [0, columnIndex]
    except:
        raise Exception(f'Error: bin cannot be reached for card {card}')


def getEmptyPosition(board, card):
    for index in range(len(board[1])):
        if board[1][index] == EMPTY:
            return [1, index]

    raise Exception(f'Error: empty position cannot be reached for card {card}')


def getExistedPosition(board, card):
    for index in range(len(board)):
        if board[index] == card:
            levelIndex = index // 8
            columnIndex = index % 8
            return [levelIndex, columnIndex]

    raise Exception(f'Error: layout position cannot be reached for card {card}')


def getFromPosition(board, card):
    return getExistedPosition(flattenBoard(board), card)


def getToPosition(board, card):
    position = getFromPosition(board, card)
    return [position[0] + 1, position[1]]


def splitMove(moveString):
    [from_position, to] = moveString.strip().split(' ')
    return [from_position.strip(), to.strip()]


def stringsToEpisode(startBoard, movesString):
    board = json.JSONDecoder().decode(startBoard)

    if not isBoardValid(board):
        raise Exception('Error: board is not valid')

    splitMoves = movesString.split(',')
    lastIndex = len(splitMoves) - 1

    episode = list()

    for (currentIndex, moveString) in enumerate(splitMoves):
        [from_string, to] = splitMove(moveString)
        fromPosition = getFromPosition(board, from_string)

        if to == 'bin':
            toPosition = getBinPosition(from_string)
        elif to == 'place':
            toPosition = getPlacePosition(board, from_string)
        elif to == "''":
            toPosition = getEmptyPosition(board, from_string)
        else:
            toPosition = getToPosition(board, to)

        move = [fromPosition, toPosition]
        prevBoard = board
        board = nextState(board, move)

        if board == prevBoard:
            raise Exception(f'Error: move ({moveString}) is not valid')

        score = getBoardScore(board)
        reward = getBoardReward(prevBoard, board)
        done = lastIndex == currentIndex

        episode.append({
            'board': prevBoard,
            'move': move,
            'score': score,
            'reward': reward,
            'done': done,
        })

    return episode
