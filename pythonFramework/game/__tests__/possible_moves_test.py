from copy import deepcopy

from pythonFramework.game.__tests__.mock import filledZeroLevel
from pythonFramework.game.next_state import nextState
from pythonFramework.game.possible_moves import possibleMoves

board = [
    ['', '', '', 'Ak', '', '', '', ''],
    ['Ab', '', 'Qc', 'Jp', '9c', '8b', '10p', '7p'],
    ['8p', '', '8k', 'Jk', '10c', 'Qp', 'Ak', 'Qb'],
    ['Ac', '', 'Kk', '5p', '5k', '4b', 'Kb', '6p'],
    ['7k', '', '8c', '10k', '4c', '2b', '3k', '7b'],
    ['Jk', '', '3b', '5b', 'Qk', '6k', '6b', '5c'],
    ['10b', '', '9p', '3c', 'Jb', 'Ap', '6c', '4b'],
    ['9k', '', 'Qb', '2c', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
]
filledBoard = deepcopy(board)
filledBoard[0] = filledZeroLevel


def test_possibleMoves():
    moves = possibleMoves(board)
    for move in moves:
        assert nextState(board, move) != board, f'should return correct moves for board with places. Move ${str(move)}'

    moves = possibleMoves(filledBoard)
    for move in moves:
        assert nextState(filledBoard, move) != filledBoard, f'should return correct moves for board without places. ' \
                                                            f'Move ${str(move)} '
