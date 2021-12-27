import {
    Board,
    CROSSES,
    CROSSES_INDEX,
    DIAMONDS,
    DIAMONDS_INDEX,
    EMPTY,
    getBoardScore,
    getSuite,
    HEARTS,
    HEARTS_INDEX,
    Move,
    nextState,
    PLACE_INDEXES,
    SPADES,
    SPADES_INDEX,
} from '../game';
import { flattenBoard, isBoardValid } from '../utils/board';

const getPlacePosition = (board: Board, card: string) => {
    for (const index of PLACE_INDEXES) {
        if (!board[0][index]) {
            return [0, index];
        }
    }

    throw new Error(`Error: place cannot be reached for card ${card}`);
};
const getBinPosition = (card: string) => {
    const suiteToIndex = {
        [HEARTS]: HEARTS_INDEX,
        [CROSSES]: CROSSES_INDEX,
        [SPADES]: SPADES_INDEX,
        [DIAMONDS]: DIAMONDS_INDEX,
    };
    const columnIndex = suiteToIndex[getSuite(card)];

    if (columnIndex === undefined) {
        throw new Error(`Error: bin cannot be reached for card ${card}`);
    }

    return [0, columnIndex];
};
const getEmptyPosition = (board: Board, card: string) => {
    const columnIndex = board[1].findIndex((firstCard) => firstCard === EMPTY);

    if (columnIndex === -1) {
        throw new Error(`Error: empty position cannot be reached for card ${card}`);
    }

    return [1, columnIndex];
};
const getExistedPosition = (board: string[], card: string) => {
    const globalIndex = board.findIndex((boardCard) => boardCard === card);
    const levelIndex = Math.floor(globalIndex / 8);
    const columnIndex = globalIndex - levelIndex * 8;

    if (globalIndex === -1 || columnIndex < 0) {
        throw new Error(`Error: layout position cannot be reached for card ${card}`);
    }

    return [levelIndex, columnIndex];
};
const getFromPosition = (board: Board, card: string) =>
    getExistedPosition(flattenBoard(board), card);
const getToPosition = (board: Board, card: string) => {
    const position = getFromPosition(board, card);
    return [position[0] + 1, position[1]]; // next level of card
};
const splitMove = (moveString: string) => {
    const [from, to] = moveString.trim().split(' ');
    return [from.trim(), to.trim()];
};

export const stringsToEpisode = (startBoard: string, movesString: string) => {
    let board = JSON.parse(startBoard);

    if (!isBoardValid(board)) {
        throw new Error('Error: board is not valid');
    }

    const splitMoves = movesString.split(',');
    const lastIndex = splitMoves.length - 1;

    return splitMoves.map((moveString, currentIndex) => {
        const [from, to] = splitMove(moveString);
        const fromPosition = getFromPosition(board, from);
        let toPosition;

        if (to === 'bin') {
            toPosition = getBinPosition(from);
        } else if (to === 'place') {
            toPosition = getPlacePosition(board, from);
            // eslint-disable-next-line quotes
        } else if (to === "''") {
            toPosition = getEmptyPosition(board, from);
        } else {
            toPosition = getToPosition(board, to);
        }

        const move = [fromPosition, toPosition] as Move;
        const prevBoard = board;
        board = nextState(board, move);

        if (board === prevBoard) {
            throw new Error(`Error: move (${moveString}) is not valid`);
        }

        const score = getBoardScore(board);
        const done = lastIndex === currentIndex;

        return {
            board: prevBoard,
            move,
            score,
            done,
        };
    });
};
