import { Bin, Board, Position, randomBoard, UNKNOWN_CARD } from '../../game';
import { flattenBoard } from '../../utils/board';
import type { Episode } from './types';
import { ProcessOneMoveType } from './types';

export const toOhe = (index: number, length: number) => {
    const ohe = new Float32Array(length);
    if (index < length) {
        ohe[index] = 1;
    }
    return ohe;
};

const getBoardOheMap = () => {
    const board = randomBoard();
    const cardSet = new Set(flattenBoard(board));
    const setLength = cardSet.size;
    const oheMap: Record<string, Float32Array> = {};

    Array.from(cardSet).forEach((card, index) => {
        oheMap[card] = toOhe(index, setLength);
    });
    oheMap[UNKNOWN_CARD] = new Float32Array(setLength); // zeros

    return [oheMap, setLength] as const;
};

export const [boardOheMap, oheLength] = getBoardOheMap();

export const encodeBoard = (layout: Board) =>
    layout.map((level) => level.map((card) => boardOheMap[card]));
export const encodeExpectedBin = (bin: Bin) => bin.map((card) => boardOheMap[card]);

const rndBoard = randomBoard();
export const xShape = [rndBoard.length, rndBoard[0].length, oheLength];
export const binShape = [4, oheLength];

export const removeIneffectiveSteps = (episode: Episode) =>
    episode.reduce((distilled, step, currentIndex) => {
        if (currentIndex > 0 && episode[currentIndex - 1].board !== step.board) {
            distilled.push(episode[currentIndex - 1]);
        }

        return distilled;
    }, []);

export const getLastBinFromEpisode = (episode: Episode) =>
    episode.at(-1).board[0].slice(4);

export const randomBinFromEpisode = (episode: Episode) => {
    const bin = getLastBinFromEpisode(episode);
    let notEmptyCards = bin.filter((card) => card).length;

    return bin.map((card) => {
        const random = Math.random();
        const replacedCard = card || UNKNOWN_CARD;

        if (random > 0.5 && card && notEmptyCards > 1) {
            notEmptyCards -= 1;
            return UNKNOWN_CARD;
        }
        return replacedCard;
    });
};

export const positionToIndexMap = (position: Position) => {
    const boardSize = xShape[0] * xShape[1];
    const from = position[0] * 8 + position[1];
    const indexMap = new Float32Array(boardSize);

    indexMap[from] = 1;
    return indexMap;
};

export const getFinalScore = (episodes: Episode) => episodes.at(-1).score;

export const getNoMovesReturn = (board: Board) =>
    ({
        score: 0,
        bestMove: [
            [0, 0],
            [0, 0],
        ],
        nextBoard: board,
    } as ReturnType<ProcessOneMoveType>);
