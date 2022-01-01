import { xShape } from '../common';
import {
    ActivationIdentifier,
    ContainerArgs,
    LayerOutput,
    Shape,
    Tensor,
    tf,
} from '../common/tf';
import { Transformer } from '../common/layers';
import { ConcatPositionEncoding } from '../common/layers/ConcatPositionEncoding';
import { range } from '../../utils';

const dense = (
    x: LayerOutput,
    units: number,
    name: string,
    activation: ActivationIdentifier = 'relu',
) => tf.layers.dense({ units, activation, name }).apply(x);

const denseSequence = (x: LayerOutput, dims: number[], name: string, block = dense) => {
    let out = x;

    for (let i = 0; i < dims.length; i++) {
        out = block(out, dims[i], `${name}_${i}`);
    }

    return out;
};

class ConcatBoards extends tf.layers.Layer {
    computeOutputShape(inputShape: Shape): Shape {
        const [b, boardInSequence, ...rest] = inputShape;
        const outShape = [b, ...rest];
        outShape[outShape.length - 1] = inputShape.at(-1) * boardInSequence;
        return outShape;
    }

    call(x: Tensor) {
        return tf.tidy(() => {
            const inX = Array.isArray(x) ? x[0] : x;
            const [, boardInSequence] = inX.shape;
            const boards = tf.split(inX, boardInSequence, 1);
            return tf.concat(boards, -1);
        });
    }

    static get className() {
        return 'ConcatBoards';
    }
}

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

    board = new ConcatBoards({ name: 'concat_boards' }).apply(board);

    // perception
    board = new ConcatPositionEncoding({ dim: 12, name: 'concat_position' }).apply(board);
    let query = board;
    for (const i of range(1)) {
        [query] = new Transformer({
            heads: 4,
            headDim: 64,
            denseDim: 64,
            attentionDropout: 0.1,
            denseDropout: 0.1,
            name: `perception_transformer_${i}`,
        }).apply([query, board] as Tensor[]) as Tensor[];
    }

    // solver
    // board = tf.layers.globalMaxPool1d({ name: 'solver_max_pool' }).apply(query);
    board = dense(query, 1, 'solver_dense');
    board = tf.layers.flatten({ name: 'solver_flatten' }).apply(board);
    board = denseSequence(board, [64, 32], 'solver_dense', dense);
    const output = dense(board, 1, 'solver_output', 'linear');

    const model = tf.model({
        inputs: inputBoards,
        outputs: output,
        name: 'model',
    } as ContainerArgs);

    model.compile({
        loss: 'meanSquaredError',
        optimizer: 'adam',
    });

    return model;
};
