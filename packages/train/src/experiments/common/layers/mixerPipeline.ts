import { range } from '../../../utils';
import { LayerOutput } from '../tf';
import { MixerLayer, MixerLayerProps } from './MixerLayer';
import { Transpose } from './Transpose';

export const mixer = (board: LayerOutput, depth: number, props: MixerLayerProps) => {
    let outBoard = new Transpose({
        perm: [2, 0, 1],
        name: `${props.name}_transpose_in`,
    }).apply(board);
    for (const i of range(depth)) {
        outBoard = new MixerLayer({
            ...props,
            name: `${props.name}_${i}`,
        }).apply(outBoard);
    }
    outBoard = new Transpose({
        perm: [1, 2, 0],
        name: `${props.name}_transpose_out`,
    }).apply(outBoard);
    return outBoard;
};
