import { Board } from '../../game';
import { Rank, Tensor } from './tf';

export type Episode = Array<{
    board: Board;
    nextBoard: Board;
    score: number;
}>;

export type X = [Tensor<Rank.R3>, number];
export type Y = number;
