import { binShape, xShape } from '../common';
import { ContainerArgs, LayerOutput, Tensor, tf } from '../common/tf';

const dense = (x: LayerOutput, units: number, name: string) =>
    tf.layers.dense({ units, activation: 'relu', name }).apply(x);

const residualBlock = (x: LayerOutput, units: number, name: string) => {
    const y = dense(x, units, `${name}_dense`);
    return tf.layers.add({ name: `${name}_add` }).apply([y, x] as Tensor[]);
};

const solverBlock = (x: LayerOutput, units: number, name: string) => {
    const [board, command] = x as Tensor[];

    let out = tf.layers
        .concatenate({ axis: -1, name: `${name}_concatenate` })
        .apply([board, command] as Tensor[]);
    out = dense(out, units, `${name}_dense`);

    return [out, command] as LayerOutput;
};

const denseSequence = (x: LayerOutput, dims: number[], name: string, block = dense) => {
    let out = x;

    for (let i = 0; i < dims.length; i++) {
        out = block(out, dims[i], `${name}_${i}`);
    }

    return out;
};

export const createModel = () => {
    const [inputShape, expectedBinShape, boardInSequence] = [xShape, binShape, 3];
    const inputBoards = tf.layers.input({
        shape: [boardInSequence, ...inputShape],
        name: 'boards',
    }); // ?x23x8x?
    const inputBin = tf.layers.input({ shape: expectedBinShape, name: 'expectedBin' }); // 4x?
    const inputSteps = tf.layers.input({ shape: [1], name: 'stepsLimit' });
    const embeddingDim = 3;

    // embeddings / board encoder
    let board = tf.layers
        .timeDistributed({
            layer: tf.layers.dense({
                units: embeddingDim,
                activation: 'relu',
                name: 'board_encoder',
            }),
        })
        .apply(inputBoards);

    // perception
    board = tf.layers
        .timeDistributed({
            layer: tf.layers.flatten({ name: 'perception_flatten' }),
        })
        .apply(board);
    board = dense(board, 128, 'perception_dense');
    board = denseSequence(board, [128, 128, 128], 'perception_residual', residualBlock);
    board = tf.layers.flatten({ name: 'perception_time_flatten' }).apply(board);

    // embeddings / bin encoder
    let bin = tf.layers
        .dense({ units: embeddingDim, activation: 'relu', name: 'bin_encoder' })
        .apply(inputBin);
    bin = tf.layers.flatten({ name: 'bin_flatten' }).apply(bin);

    // steps encoder
    const steps = tf.layers
        .dense({ units: embeddingDim, activation: 'sigmoid', name: 'steps_encoder' })
        .apply(inputSteps);

    // solver
    const command = tf.layers
        .concatenate({ axis: -1, name: 'command_concatenate' })
        .apply([bin, steps] as Tensor[]);
    // command = tf.layers
    //     .repeatVector({ n: boardInSequence, name: 'command_repeatVector' })
    //     .apply(command);
    [board] = denseSequence(
        [board, command] as Tensor[],
        [128, 128, 128, 64, 32],
        'solver',
        solverBlock,
    ) as Tensor[];
    const output = dense(board, 1, 'solver_output');

    const model = tf.model({
        inputs: [inputBoards, inputBin, inputSteps],
        outputs: output,
        name: 'model',
    } as ContainerArgs);

    model.compile({
        loss: 'meanSquaredError',
        optimizer: 'adam',
    });

    return model;
};
