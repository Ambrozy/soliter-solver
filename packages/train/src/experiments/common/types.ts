import { Bin, Board, Move } from '../../game';
import { LayersModel } from './tf';

export type Episode = Array<{
    board: Board;
    move: Move;
    score: number;
    reward: number;
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
    stepIndex: number,
) => {
    score: number;
    reward: number;
    bestMove: Move;
    nextBoard: Board;
};

export type Replay = {
    startBoard: string;
    history: string;
};

export interface TrainLog {
    loss: number[];
}

export interface ReplayBufferLog {
    episodes: number;
    steps: number;
}
