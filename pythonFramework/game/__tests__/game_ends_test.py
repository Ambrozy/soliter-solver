from pythonFramework.game.constants import UNKNOWN_CARD
from pythonFramework.game.game_ends import isWinBin, isLose, isBinReached


def test_isWinBin():
    assert isWinBin([['', '', '', '', 'Kc', 'Kk', 'Kp', 'Kb'], []]) is True, 'should return true if bin filled'
    assert isWinBin([['', '', '', '', 'Ac', 'Kk', 'Kp', 'Kb'], []]) is False, 'should return false if bin not filled'


def test_isLose():
    board = [
        ['2c', '', '2p', '2b', '3c', '3k', '3p', '3b'],
        ['4c', '10k', '10p', '10b', 'Jc', 'Jk', 'Jp', 'Jb'],
        ['3p', 'Qk', 'Qp', 'Qb', 'Kc', 'Kk', 'Kp', 'Kb'],
        ['2c', 'Qk', 'Qp', 'Qb', '9c', '9k', '9p', '9b'],
        ['', '', '', '', '', '', '', ''],
    ]
    assert isLose(board) is False, 'should return false when has empty place'
    board = [
        ['2c', '2k', '2p', '2b', '3c', '3k', '3p', '3b'],
        ['4c', '', '10p', '10b', 'Jc', 'Jk', 'Jp', 'Jb'],
        ['3p', '', 'Qp', 'Qb', 'Kc', 'Kk', 'Kp', 'Kb'],
        ['2c', '', 'Qp', 'Qb', '9c', '9k', '9p', '9b'],
        ['', '', '', '', '', '', '', ''],
    ]
    assert isLose(board) is False, 'should return false when has empty column'
    board = [
        ['2c', '2k', '2p', '2b', '3c', '3k', '3p', '3b'],
        ['4c', '10k', '10p', '10b', 'Jc', 'Jk', 'Jp', 'Jb'],
        ['3p', 'Qk', 'Qp', 'Qb', 'Kc', 'Kk', 'Kp', 'Kb'],
        ['2c', '4k', 'Qp', 'Qb', '9c', '9k', '9p', '9b'],
        ['', '', '', '', '', '', '', ''],
    ]
    assert isLose(board) is False, 'should return false when has move to bin'
    board = [
        ['2c', '2k', '2p', '2b', '3c', '3k', '3p', '3b'],
        ['4c', '10k', '10p', '10b', 'Jc', 'Jk', 'Jp', 'Jb'],
        ['3p', 'Qk', 'Qp', 'Qb', 'Kc', 'Kk', 'Kp', 'Kb'],
        ['2c', 'Ak', 'Qp', 'Qb', '9c', '9k', '9p', '9b'],
        ['', '', '', '', '', '', '', ''],
    ]
    assert isLose(board) is False, 'should return false when has move to column'
    board = [
        ['', '', '', '', '3c', '3k', '3p', '3b'],
        ['4c', '5k', '10p', '10b', 'Jc', 'Jk', 'Jp', 'Jb'],
        ['3p', '', 'Qp', 'Qb', 'Kc', 'Kk', 'Kp', 'Kb'],
        ['2c', '', 'Qp', 'Qb', '9c', '9k', '9p', '9b'],
        ['', '', '', '', '', '', '', ''],
    ]
    assert isLose(board) is False, 'should return false when can move stack to column'
    board = [
        ['2c', '2k', '2p', '2b', '3c', '3k', '3p', '3b'],
        ['4c', '10k', '10p', '10b', 'Jc', 'Jk', 'Jp', 'Jb'],
        ['3p', 'Qk', 'Qp', 'Qb', 'Kc', 'Kk', 'Kp', 'Kb'],
        ['2c', 'Qk', 'Qp', 'Qb', '9c', '9k', '9p', '9b'],
        ['', '', '', '', '', '', '', ''],
    ]
    assert isLose(board) is True, 'should return true when no moves left'


def test_isBinReached():
    board = [['', '', '', '', 'Qc', 'Qk', 'Jp', '9b'], []]
    assert isBinReached(board, ['Qc', 'Qk', 'Jp', '9b']) is True, 'should return true when bin reached'
    assert isBinReached(board, ['9b', 'Qc', UNKNOWN_CARD, 'Jp']) is True, 'should return true when bin reached'
    assert isBinReached(board, [UNKNOWN_CARD, 'Qk', '10p', '9b']) is True, 'should return true when bin reached'
    assert isBinReached(board, ['10p', UNKNOWN_CARD, UNKNOWN_CARD, '2b']) is True, 'should return true when bin reached'
    assert isBinReached(board, [
        UNKNOWN_CARD,
        UNKNOWN_CARD,
        '8p',
        UNKNOWN_CARD]) is True, 'should return true when bin reached'
    assert isBinReached(board, [
        UNKNOWN_CARD,
        UNKNOWN_CARD,
        UNKNOWN_CARD,
        UNKNOWN_CARD,
    ]) is True, 'should return true when bin reached'

    assert isBinReached(board, ['Jc', 'Kk', 'Kp', 'Kb']) is False, 'should return false when bin does not reached'
    assert isBinReached(board, [UNKNOWN_CARD, '2p', 'Kk', 'Kb']) is False, 'should return false when bin does not ' \
                                                                           'reached '
    assert isBinReached(board, ['Kp', UNKNOWN_CARD, UNKNOWN_CARD, '6b']) is False, 'should return false when bin does ' \
                                                                                   'not reached '
    assert isBinReached(board, [UNKNOWN_CARD, UNKNOWN_CARD, 'Qp', UNKNOWN_CARD]) is False, 'should return false when ' \
                                                                                            'bin does not reached '
