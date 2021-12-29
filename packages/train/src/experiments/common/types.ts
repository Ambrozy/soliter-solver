import { Bin, Board, Move } from '../../game';
import { LayersModel } from './tf';

export type Episode = Array<{
    board: Board;
    move: Move;
    score: number;
    done: boolean;
}>;

export type SamplerType = (_: number[]) => number;
export type ProcessOneMoveType = (
    model: LayersModel,
    episode: Episode,
    board: Board,
    bin: Bin,
    steps: number,
    sampler: SamplerType,
) => {
    score: number;
    bestMove: Move;
    nextBoard: Board;
};

export interface TrainLog {
    loss: number[];
}

export interface ReplayBufferLog {
    episodes: number;
    steps: number;
}