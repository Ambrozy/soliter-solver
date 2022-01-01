from unittest import TestCase
from pythonFramework.game.utils import getSuite, toCardNumber, isRed, isCompatible, isCompatibleBin, getLeftSpace, \
    getStackPossibleLength, getLastCards, getCardStackLength, getAt, copyBoard, isValidCard


def test_getSuite():
    assert getSuite('Kk') == 'k', 'should return last letter'


def test_toCardNumber():
    assert toCardNumber('Ak') == 1, 'should return correct number for Ak'
    assert toCardNumber('2c') == 2, 'should return correct number for 2c'
    assert toCardNumber('3c') == 3, 'should return correct number for 3c'
    assert toCardNumber('4c') == 4, 'should return correct number for 4c'
    assert toCardNumber('5c') == 5, 'should return correct number for 5c'
    assert toCardNumber('6c') == 6, 'should return correct number for 6c'
    assert toCardNumber('7c') == 7, 'should return correct number for 7c'
    assert toCardNumber('8c') == 8, 'should return correct number for 8c'
    assert toCardNumber('9c') == 9, 'should return correct number for 9c'
    assert toCardNumber('10c') == 10, 'should return correct number for 10c'
    assert toCardNumber('Jp') == 11, 'should return correct number for Jp'
    assert toCardNumber('Qc') == 12, 'should return correct number for Qc'
    assert toCardNumber('Kk') == 13, 'should return correct number for Kk'


def test_isRed():
    assert isRed('Ab') is True, 'should return true if suite is red for Ab'
    assert isRed('2c') is True, 'should return true if suite is red for 2c'
    assert isRed('Ak') is False, 'should return true if suite is black for Ak'
    assert isRed('2p') is False, 'should return true if suite is black for 2p'


def test_isCompatible():
    assert isCompatible('2k', 'Ab') is True, 'should return true if cards are compatible'
    assert isCompatible('Kk', 'Qb') is True, 'should return true if cards are compatible'
    assert isCompatible('', 'Ab') is True, 'should return true if bottom card is empty card'
    assert isCompatible('', 'Qb') is True, 'should return true if bottom card is empty card'
    assert isCompatible('Qb', 'Kk') is False, 'should return false if cards are not compatible'
    assert isCompatible('2p', 'Jp') is False, 'should return false if cards are not compatible'


def test_isCompatibleBin():
    assert isCompatibleBin('2b', '3b') is True, 'should return true if cards are compatible with bin'
    assert isCompatibleBin('5k', '6k') is True, 'should return true if cards are compatible with bin'
    assert isCompatibleBin('Qc', 'Kc') is True, 'should return true if cards are compatible with bin'
    assert isCompatibleBin('10p', 'Jp') is True, 'should return true if cards are compatible with bin'
    assert isCompatibleBin('', 'Ab') is True, 'should return true if bin card is empty card and only A otherwise false'
    assert isCompatibleBin('', '6k') is False, 'should return true if bin card is empty card and only A otherwise false'
    assert isCompatibleBin('', 'Kc') is False, 'should return true if bin card is empty card and only A otherwise false'
    assert isCompatibleBin('', '2p') is False, 'should return true if bin card is empty card and only A otherwise false'
    assert isCompatibleBin('2b', '10b') is False, 'should return false if cards are not compatible with bin'
    assert isCompatibleBin('Kk', 'Ak') is False, 'should return false if cards are not compatible with bin'
    assert isCompatibleBin('Qc', 'Kp') is False, 'should return false if cards are not compatible with bin'
    assert isCompatibleBin('10p', 'Jk') is False, 'should return false if cards are not compatible with bin'


def test_getLeftSpace():
    assert getLeftSpace(
        [['', '', '', '', '', '', '', ''], []]) == 4, 'should return correct left space if place is free'
    assert getLeftSpace(
        [['2b', '2b', '2b', '2b', '', '', '', ''], []]) == 0, 'should return correct left space if place is full'


def test_getStackPossibleLength():
    board = [
        ['', '', '', '', '', '', '', ''],
        ['2b', '2b', '2b', '2b', '2b', '2b', '', ''],
    ]
    assert getStackPossibleLength(board) == 15, 'should return correct max stack length when has free place and free ' \
                                                'columns '
    board = [
        ['', '2b', '2b', '2b', '', '', '', ''],
        ['2b', '2b', '2b', '2b', '2b', '2b', '', ''],
    ]
    assert getStackPossibleLength(board) == 6, 'should return correct max stack length when has less place and free ' \
                                               'columns '
    board = [
        ['2b', '2b', '2b', '2b', '', '', '', ''],
        ['2b', '2b', '2b', '2b', '2b', '2b', '2b', '2b'],
    ]
    assert getStackPossibleLength(board) == 1, 'should return correct max stack length when has no place and no free ' \
                                               'columns '
    board = [
        ['', '', '', '', '', '', '', ''],
        ['2b', '2b', '2b', '2b', '2b', '2b', '', ''],
    ]
    assert getStackPossibleLength(board, True) == 10, 'should return correct max stack length when has free place, ' \
                                                      'free columns and card goes to empty column '
    board = [
        ['2b', '2b', '2b', '2b', '', '', '', ''],
        ['2b', '2b', '2b', '2b', '2b', '2b', '2b', ''],
    ]
    assert getStackPossibleLength(board, True) == 1, 'should return correct max stack length when card goes to last ' \
                                                     'empty column '


def test_getLastCards():
    board = [
        ['', '', '', '', '', '', '', ''],
        ['Kk', '', '2c', '3p', '9c', '4k', '6c', '9b'],
        ['Qc', '', '', '', '', '', '', '10b'],
        ['Jp', '', '', '', '', '', '', ''],
    ]
    TestCase().assertEquals(getLastCards(board), [
        ['Jp', '', '2c', '3p', '9c', '4k', '6c', '10b'],
        [3, 1, 1, 1, 1, 1, 1, 2],
    ], 'should return correct arrays')


def test_getCardStackLength():
    board = [
        ['', '', '', '', '', '', '', ''],
        ['Kk', '', '2c', '3p', '9c', '4k', '6c', '9b'],
        ['Qc', '', '3k', '', '', '', '', '10b'],
        ['Jp', '', '10k', '', '', '', '', ''],
    ]
    assert getCardStackLength(board, [1, 0]) == 3, 'should return correct stack length when stack'
    assert getCardStackLength(board, [2, 0]) == 2, 'should return correct stack length when stack'
    assert getCardStackLength(board, [2, 7]) == 1, 'should return one when single card'
    assert getCardStackLength(board, [1, 2]) == 0, 'should return zero when blocked stack'
    assert getCardStackLength(board, [2, 1]) == 0, 'should return zero when empty space'
    assert getCardStackLength(board, [1, 1]) == 0, 'should return zero when no card'
    assert getCardStackLength(board, [1, 7]) == 0, 'should return zero when blocked card'


def test_getAt():
    board = [
        ['Qc', '', '3k', '', '', '', '', '10b'],
        ['Kk', '', '2c', '3p', '9c', '4k', '6c', '9b'],
    ]
    assert getAt(board, [1, 3]) == '3p', 'should return correct item'
    assert getAt(board, [10, 30]) == '', 'should return empty if out of range'


def test_copyBoard():
    board = [
        ['Qc', '', '3k', '', '', '', '', '10b'],
        ['Kk', '', '2c', '3p', '9c', '4k', '6c', '9b'],
    ]
    copied = copyBoard(board)
    TestCase().assertEquals(board, copied, 'should correct copy')
    copied[0][0] = ''

    assert board[0][0] != copied[0][0], 'edition of copy should not effect on source board'


def test_isValidCard():
    assert isValidCard('Ac') is True, 'should return true for correct cards'
    assert isValidCard('Ah') is False, 'should return false for incorrect cards'
    assert isValidCard('Yc') is False, 'should return false for incorrect cards'
