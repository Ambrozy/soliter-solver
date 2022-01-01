from unittest import TestCase

from pythonFramework.game.__tests__.mock import filledBoard, freePosition, freeBoard
from pythonFramework.game.next_state import nextState


def test_nextState_negative_cases():
    TestCase().assertEqual(
        nextState(filledBoard, [[0, 4], freePosition]),
        filledBoard,
        'should return the same board when move from bin'
    )
    TestCase().assertEqual(
        nextState(filledBoard, [[1, 3], [0, 0]]),
        filledBoard,
        'should return the same board when move to filled place'
    )
    TestCase().assertEqual(
        nextState(filledBoard, [freePosition, [2, 3]]),
        filledBoard,
        'should return the same board when move nothing'
    )
    TestCase().assertEqual(
        nextState(filledBoard, [[1, 3], [1, 3]]),
        filledBoard,
        'should return the same board when move to self'
    )
    TestCase().assertEqual(
        nextState(filledBoard, [[1, 3], [0, 6]]),
        filledBoard,
        'should return the same board when move to wrong bin'
    )
    TestCase().assertEqual(
        nextState(filledBoard, [[1, 2], [2, 4]]),
        filledBoard,
        'should return the same board when move to wrong column'
    )
    TestCase().assertEqual(
        nextState(filledBoard, [[2, 0], [0, 0]]),
        filledBoard,
        'should return the same board when move stack to place'
    )
    TestCase().assertEqual(
        nextState(filledBoard, [[2, 7], [0, 0]]),
        filledBoard,
        'should return the same board when move wrong stack to place'
    )
    TestCase().assertEqual(
        nextState(filledBoard, [[2, 0], [0, 4]]),
        filledBoard,
        'should return the same board when move stack to bin'
    )
    TestCase().assertEqual(
        nextState(filledBoard, [[2, 7], [0, 4]]),
        filledBoard,
        'should return the same board when move wrong stack to bin'
    )
    TestCase().assertEqual(
        nextState(filledBoard, [[1, 7], freePosition]),
        filledBoard,
        'should return the same board when move wrong stack'
    )
    TestCase().assertEqual(
        nextState(filledBoard, [[2, 0], freePosition]),
        filledBoard,
        'should return the same board when move big stack'
    )
    TestCase().assertEqual(
        nextState(freeBoard, [[2, 0], freePosition]),
        freeBoard,
        'should return the same board when move big stack'
    )
    TestCase().assertEqual(
        nextState(freeBoard, [[9, 0], [1, 2]]),
        freeBoard,
        'should return the same board when move stack to wrong destination'
    )


def test_nextState_positive_cases():
    expectedBoard = [
        ['', '', '', '', '2c', '', '', ''],
        ['Kk', '', '', '3p', '9c', '4k', '6c', '9b'],
        ['Qc', '', '', '', '', '', '', '10b'],
        ['Jp', '', '', '', '', '', '', ''],
        ['10b', '', '', '', '', '', '', ''],
        ['9k', '', '', '', '', '', '', ''],
        ['8b', '', '', '', '', '', '', ''],
        ['7p', '', '', '', '', '', '', ''],
        ['6b', '', '', '', '', '', '', ''],
        ['5p', '', '', '', '', '', '', ''],
        ['4b', '', '', '', '', '', '', ''],
        ['3p', '', '', '', '', '', '', ''],
        ['2b', '', '', '', '', '', '', ''],
    ]
    freeBoard[0][4] = 'Ac'
    TestCase().assertEquals(
        nextState(freeBoard, [[1, 2], [0, 4]]),
        expectedBoard,
        'should return next board when move to empty bin'
    )
    freeBoard[0][4] = ''
    # ------------------------
    expectedBoard = [
        ['2c', '', '', '', '', '', '', ''],
        ['Kk', '', '', '3p', '9c', '4k', '6c', '9b'],
        ['Qc', '', '', '', '', '', '', '10b'],
        ['Jp', '', '', '', '', '', '', ''],
        ['10b', '', '', '', '', '', '', ''],
        ['9k', '', '', '', '', '', '', ''],
        ['8b', '', '', '', '', '', '', ''],
        ['7p', '', '', '', '', '', '', ''],
        ['6b', '', '', '', '', '', '', ''],
        ['5p', '', '', '', '', '', '', ''],
        ['4b', '', '', '', '', '', '', ''],
        ['3p', '', '', '', '', '', '', ''],
        ['2b', '', '', '', '', '', '', ''],
    ]
    TestCase().assertEquals(
        nextState(freeBoard, [[1, 2], [0, 0]]),
        expectedBoard,
        'should return next board when move to empty place'
    )
    # ------------------------
    expectedBoard = [
        ['', '', '', '', '', '', '', ''],
        ['Kk', '2c', '', '3p', '9c', '4k', '6c', '9b'],
        ['Qc', '', '', '', '', '', '', '10b'],
        ['Jp', '', '', '', '', '', '', ''],
        ['10b', '', '', '', '', '', '', ''],
        ['9k', '', '', '', '', '', '', ''],
        ['8b', '', '', '', '', '', '', ''],
        ['7p', '', '', '', '', '', '', ''],
        ['6b', '', '', '', '', '', '', ''],
        ['5p', '', '', '', '', '', '', ''],
        ['4b', '', '', '', '', '', '', ''],
        ['3p', '', '', '', '', '', '', ''],
        ['2b', '', '', '', '', '', '', ''],
    ]
    TestCase().assertEquals(
        nextState(freeBoard, [[1, 2], freePosition]),
        expectedBoard,
        'should return next board when move card to empty column'
    )
    # ------------------------
    expectedBoard = [
        ['', '', '', '', '', '', '', ''],
        ['Kk', '5p', '2c', '3p', '9c', '4k', '6c', '9b'],
        ['Qc', '4b', '', '', '', '', '', '10b'],
        ['Jp', '3p', '', '', '', '', '', ''],
        ['10b', '2b', '', '', '', '', '', ''],
        ['9k', '', '', '', '', '', '', ''],
        ['8b', '', '', '', '', '', '', ''],
        ['7p', '', '', '', '', '', '', ''],
        ['6b', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
    ]
    TestCase().assertEquals(
        nextState(freeBoard, [[9, 0], freePosition]),
        expectedBoard,
        'should return next board when move stack to empty column'
    )
    # ------------------------
    expectedBoard = [
        ['', '2k', '2p', '2b', 'Jc', '3k', '3p', '3b'],
        ['Kk', '2c', '2c', '3p', '9c', '4k', '6c', '9b'],
        ['Qc', '', '', '', '', '', '', '10b'],
        ['Jp', '', '', '', '', '', '', ''],
        ['10b', '', '', '', '', '', '', ''],
        ['9k', '', '', '', '', '', '', ''],
        ['8b', '', '', '', '', '', '', ''],
        ['7p', '', '', '', '', '', '', ''],
        ['6b', '', '', '', '', '', '', ''],
        ['5p', '', '', '', '', '', '', ''],
        ['4b', '', '', '', '', '', '', ''],
        ['3p', '', '', '', '', '', '', ''],
        ['2b', '', '', '', '', '', '', ''],
    ]
    TestCase().assertEquals(
        nextState(filledBoard, [[0, 0], freePosition]),
        expectedBoard,
        'should return next board when move from place to empty column'
    )
    # ------------------------
    expectedBoard = [
        ['', '2k', '2p', '2b', 'Jc', '3k', '3p', '3b'],
        ['Kk', '', '2c', '3p', '9c', '4k', '6c', '9b'],
        ['Qc', '', '', '2c', '', '', '', '10b'],
        ['Jp', '', '', '', '', '', '', ''],
        ['10b', '', '', '', '', '', '', ''],
        ['9k', '', '', '', '', '', '', ''],
        ['8b', '', '', '', '', '', '', ''],
        ['7p', '', '', '', '', '', '', ''],
        ['6b', '', '', '', '', '', '', ''],
        ['5p', '', '', '', '', '', '', ''],
        ['4b', '', '', '', '', '', '', ''],
        ['3p', '', '', '', '', '', '', ''],
        ['2b', '', '', '', '', '', '', ''],
    ]
    TestCase().assertEquals(
        nextState(filledBoard, [[0, 0], [2, 3]]),
        expectedBoard,
        'should return next board when move from place to right column'
    )
    # ------------------------
    expectedBoard = [
        ['', '', '', '', '', '', '', ''],
        ['Kk', '', '', '3p', '9c', '4k', '6c', '9b'],
        ['Qc', '', '', '2c', '', '', '', '10b'],
        ['Jp', '', '', '', '', '', '', ''],
        ['10b', '', '', '', '', '', '', ''],
        ['9k', '', '', '', '', '', '', ''],
        ['8b', '', '', '', '', '', '', ''],
        ['7p', '', '', '', '', '', '', ''],
        ['6b', '', '', '', '', '', '', ''],
        ['5p', '', '', '', '', '', '', ''],
        ['4b', '', '', '', '', '', '', ''],
        ['3p', '', '', '', '', '', '', ''],
        ['2b', '', '', '', '', '', '', ''],
    ]
    TestCase().assertEquals(
        nextState(freeBoard, [[1, 2], [2, 3]]),
        expectedBoard,
        'should return next board when move card to right column'
    )
    # ------------------------
    expectedBoard = [
        ['', '', '', '', '', '', '', ''],
        ['Kk', '', '2c', '3p', '9c', '4k', '6c', '9b'],
        ['Qc', '', '', '', '', '', '5p', '10b'],
        ['Jp', '', '', '', '', '', '4b', ''],
        ['10b', '', '', '', '', '', '3p', ''],
        ['9k', '', '', '', '', '', '2b', ''],
        ['8b', '', '', '', '', '', '', ''],
        ['7p', '', '', '', '', '', '', ''],
        ['6b', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
    ]
    TestCase().assertEquals(
        nextState(freeBoard, [[9, 0], [2, 6]]),
        expectedBoard,
        'should return next board when move stack to right column'
    )
    # ------------------------
    expectedBoard = [
        ['2c', '2k', '2p', '2b', 'Jc', '4k', '3p', '3b'],
        ['Kk', '', '2c', '3p', '9c', '', '6c', '9b'],
        ['Qc', '', '', '', '', '', '', '10b'],
        ['Jp', '', '', '', '', '', '', ''],
        ['10b', '', '', '', '', '', '', ''],
        ['9k', '', '', '', '', '', '', ''],
        ['8b', '', '', '', '', '', '', ''],
        ['7p', '', '', '', '', '', '', ''],
        ['6b', '', '', '', '', '', '', ''],
        ['5p', '', '', '', '', '', '', ''],
        ['4b', '', '', '', '', '', '', ''],
        ['3p', '', '', '', '', '', '', ''],
        ['2b', '', '', '', '', '', '', ''],
    ]
    TestCase().assertEquals(
        nextState(filledBoard, [[1, 5], [0, 5]]),
        expectedBoard,
        'should return next board when move card to right bin'
    )


def test_nextState_special_cases():
    board = [
        ['', '', '', '', '', '', '', ''],
        ['Ab', 'Ap', 'Qc', 'Jp', '9c', '8b', '10p', '7p'],
        ['8p', 'Kc', '8k', 'Jk', '10c', 'Qp', 'Ak', 'Qb'],
        ['Ac', '7c', 'Kk', '5p', '5k', '4b', 'Kb', '6p'],
        ['7k', 'Kp', '8c', '10k', '4c', '2b', '3k', '7b'],
        ['9b', '2p', '3b', '5b', 'Qk', '6k', '6b', '5c'],
        ['4p', 'Jc', '9p', '3c', 'Jb', '3p', '6c', '10b'],
        ['9k', '4k', '2k', '2c', '', '', '', ''],
    ]
    move3 = [
        [6, 5],
        [13, 7],
    ]
    move4 = [
        [6, 5],
        [26, 13],
    ]
    TestCase().assertEquals(
        nextState(board, move3),
        board,
        'should work correctly'
    )
    TestCase().assertEquals(
        nextState(board, move4),
        board,
        'should work correctly'
    )
