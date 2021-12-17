import { Board } from '../../game';
import { Tensor4D, Tensor2D } from './tf';

export type Episode = Array<{
    board: Board;
    nextBoard: Board;
    score: number;
}>;

export type X = [Tensor4D, Tensor2D];
export type Y = Tensor2D;
