from pythonFramework.game.score import getBinScore, getBoardScore, getBoardReward
from pythonFramework.game.utils import copyBoard

mockBoard = [
    ['', '', '', '', 'Ac', 'Ak', 'Ap', 'Ab'],
    ['2c', '2k', '2p', '2b', '3c', '3k', '3p', '3b'],
    ['4c', '4k', '4p', '4b', '5c', '5k', '5p', '5b'],
    ['6c', '6k', '6p', '6b', '7c', '7k', '7p', '7b'],
    ['8c', '8k', '8p', '8b', '9c', '9k', '9p', '9b'],
    ['10c', '10k', '10p', '10b', 'Jc', 'Jk', 'Jp', 'Jb'],
    ['Qc', 'Qk', 'Qp', 'Qb', 'Kc', 'Kk', 'Kp', 'Kb'],
]


def test_getBinScore():
    assert getBinScore(mockBoard) == 4, 'should return score'


def test_getBoardScore():
    assert getBoardScore(mockBoard) == 9, 'should return score'


def test_getBoardReward():
    nextBoard = copyBoard(mockBoard)
    nextBoard[0][4] = '2c'
    assert getBoardReward(mockBoard, nextBoard) == 1, 'should return +1 when bin changed'

    nextBoard = [
        ['Qc', 'Qk', 'Qp', 'Qb', 'Ac', 'Ak', 'Ap', 'Ab'],
        ['2c', '2k', '2p', '2b', '3c', '3k', '3p', '3b'],
        ['4c', '4k', '4p', '4b', '5c', '5k', '5p', '5b'],
        ['6c', '6k', '6p', '6b', '7c', '7k', '7p', '7b'],
        ['Kc', 'Kk', 'Kp', 'Kb', '9c', '9k', '9p', '9b'],
        ['10c', '10k', '10p', '10b', 'Jc', 'Jk', 'Jp', 'Jb'],
        ['', '', '', '', '8c', '8k', '8p', '8b'],
    ]
    assert getBoardReward(mockBoard, nextBoard) == -1, 'should return -1 when lose'
