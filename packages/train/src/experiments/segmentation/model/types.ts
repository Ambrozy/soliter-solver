import { Board, Move } from '../../../game';

export type Episode = Array<{
    board: Board;
    move: Move;
    score: number;
    done: boolean;
}>;
