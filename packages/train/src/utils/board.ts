import type { Board } from '../game';
import { randomBoard } from '../game';

export const flattenBoard = (board: Board) =>
    board.reduce((flatten, level) => [...flatten, ...level], []);

const randomFlattenedBoard = flattenBoard(randomBoard()).sort();
export const isBoardValid = (board: Board) => {
    if (Array.isArray(board) && Array.isArray(board[0]) && board[0].length === 8) {
        const flattenedBoard = flattenBoard(board).sort();
        return flattenedBoard.every(
            (card, index) => card === randomFlattenedBoard[index],
        );
    }

    return false;
};
