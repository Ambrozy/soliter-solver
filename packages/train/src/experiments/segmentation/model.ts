import { range } from '../../utils';
import { binShape, xShape } from '../common';
import {
    ConcatLayer,
    conv2dLayer,
    MixerLayer,
    MixerLayerProps,
    Transpose,
} from '../common/layers';
import { ContainerArgs, LayerOutput, Tensor, tf } from '../common/tf';

const mixer = (board: LayerOutput, depth: number, props: MixerLayerProps) => {
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

export const createModel = () => {
    const [inputShape, expectedBinShape] = [xShape, binShape];
    const inputBoard = tf.layers.input({ shape: inputShape, name: 'board' }); // 23x8x?
    const inputBin = tf.layers.input({ shape: expectedBinShape, name: 'expectedBin' }); // 4x?
    const inputSteps = tf.layers.input({ shape: [1], name: 'stepsLimit' });
    const embeddingDim = 3;

    // embeddings / board encoder
    let board = tf.layers
        .dense({
            units: embeddingDim,
            activation: 'relu',
            name: 'board_encoder',
        })
        .apply(inputBoard);
    // perception
    board = mixer(board, 5, {
        hiddenDim: 64,
        widthDim: inputShape[0],
        heightDim: inputShape[1],
        name: 'perception_mixer',
    });

    // embeddings / bin encoder
    let bin = tf.layers
        .dense({ units: embeddingDim, activation: 'relu', name: 'bin_encoder_1' })
        .apply(inputBin);
    bin = tf.layers.flatten({ name: 'bin_flatten' }).apply(bin);
    bin = tf.layers
        .dense({ units: embeddingDim, activation: 'relu', name: 'bin_encoder_2' })
        .apply(bin);

    // steps encoder
    const steps = tf.layers
        .dense({ units: embeddingDim, activation: 'sigmoid', name: 'steps_encoder' })
        .apply(inputSteps);

    // solver card from
    let from = new ConcatLayer().apply([board, bin, steps] as Tensor[]); // concat by channels
    from = tf.layers
        .dense({
            units: embeddingDim,
            activation: 'relu',
            name: 'from_dense_after_concat',
        })
        .apply(from);
    from = mixer(from, 5, {
        hiddenDim: 64,
        widthDim: inputShape[0],
        heightDim: inputShape[1],
        name: 'from_mixer',
    });

    // solver card out
    let to = new ConcatLayer().apply([from, bin, steps] as Tensor[]); // concat by channels
    to = tf.layers
        .dense({ units: embeddingDim, activation: 'relu', name: 'to_dense_after_concat' })
        .apply(to);
    to = mixer(to, 5, {
        hiddenDim: 64,
        widthDim: inputShape[0],
        heightDim: inputShape[1],
        name: 'to_mixer',
    });

    // index map
    const lastLayer = conv2dLayer(1, 1); // tf.layers.dense({ units: 1, name: 'output_dense' });
    const softmaxLayer = tf.layers.softmax({ axis: -1 });

    from = lastLayer.apply(from);
    from = softmaxLayer.apply(from);
    from = tf.layers.flatten({ name: 'from' }).apply(from);

    to = lastLayer.apply(to);
    to = softmaxLayer.apply(to);
    to = tf.layers.flatten({ name: 'to' }).apply(to);

    return tf.model({
        inputs: [inputBoard, inputBin, inputSteps],
        outputs: [from, to],
        name: 'model',
    } as ContainerArgs);
};
