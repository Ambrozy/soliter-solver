import { xShape } from '../common';
import {
    ActivationIdentifier,
    ContainerArgs,
    LayerOutput,
    Tensor,
    tf,
} from '../common/tf';

const dense = (
    x: LayerOutput,
    units: number,
    name: string,
    activation: ActivationIdentifier = 'relu',
) => tf.layers.dense({ units, activation, name }).apply(x);

const residualBlock = (x: LayerOutput, units: number, name: string) => {
    const y = dense(x, units, `${name}_dense`);
    return tf.layers.add({ name: `${name}_add` }).apply([y, x] as Tensor[]);
};

const denseSequence = (x: LayerOutput, dims: number[], name: string, block = dense) => {
    let out = x;

    for (let i = 0; i < dims.length; i++) {
        out = block(out, dims[i], `${name}_${i}`);
    }

    return out;
};

export const createModel = () => {
    const [inputShape, boardInSequence, embeddingDim] = [xShape, 3, 3];
    const inputBoards = tf.layers.input({
        shape: [boardInSequence, ...inputShape],
        name: 'boards',
    }); // ?x23x8x?

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

    // solver
    board = denseSequence(board, [128, 128, 64, 32], 'solver_dense', dense);
    // const output = dense(board, 1, 'solver_output', 'sigmoid');
    const output = dense(board, 1, 'solver_output', 'linear');

    const model = tf.model({
        inputs: inputBoards,
        outputs: output,
        name: 'model',
    } as ContainerArgs);

    model.compile({
        loss: 'meanSquaredError',
        // loss: (yTrue: Tensor, yPred: Tensor) => tf.log(yPred).mul(-1).mul(yTrue), // binaryCrossentropy
        optimizer: 'adam',
    });

    return model;
};
