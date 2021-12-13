import { Board, moveToString, nextState, NONE_MOVE, possibleMoves } from '../game';
import { force, scoreToProbabilities } from '../utils';
import { LayersModel, predictReward } from './model';

export const inference = (model: LayersModel, board: Board, steps: number) => {
    const moves = possibleMoves(board);

    if (moves.length) {
        const x = moves.map((move) => [board, nextState(board, move)]);
        const predications = predictReward(model, x, steps);
        const bestMove = moves[force(scoreToProbabilities(predications))];
        return moveToString(board, bestMove);
    }

    return moveToString(board, NONE_MOVE);
};
