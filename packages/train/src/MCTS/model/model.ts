import { Board } from '../../game';
import { ContainerArgs, LayersModel, LayerOutput, Rank, Tensor, tf } from './tf';
import { prepareBatch } from './utils';

export const predictReward = (model: LayersModel, boards: Board[][], steps: number) => {
    const batch = prepareBatch(boards, steps);

    console.log(model);
    // model.predict(batch);
    // TODO: add number extraction from model results
    return batch.map(() => Math.random() + steps);
};

const conv2d = (x: LayerOutput, numChannels: number, kernelSize: number, stride = 1) =>
    tf.layers
        .conv2d({
            filters: numChannels,
            kernelSize,
            strides: stride,
            padding: 'valid',
            activation: 'linear',
            useBias: false,
        })
        .apply(x);

export const createModel = (inputShape: number[]) => {
    const inputBoard = tf.layers.input({ shape: inputShape });
    const inputSteps = tf.layers.input({ shape: [1] });
    let out: LayerOutput;

    out = conv2d(inputBoard, 2, 1); // embeddings
    out = tf.layers.batchNormalization().apply(out);
    out = tf.layers.reLU().apply(out);
    out = tf.layers.flatten().apply(out);
    out = tf.layers.dense({ units: 128, activation: 'relu' }).apply(out);

    const steps = tf.layers.dense({ units: 1, activation: 'relu' }).apply(inputSteps);

    out = tf.layers.concatenate().apply([out, steps] as Tensor<Rank>[]);
    out = tf.layers.dense({ units: 32, activation: 'relu' }).apply(out);

    out = tf.layers.concatenate().apply([out, steps] as Tensor<Rank>[]);
    out = tf.layers.dense({ units: 1, activation: 'relu' }).apply(out);

    return tf.model({
        inputs: [inputBoard, inputSteps],
        outputs: out,
        name: 'model',
    } as ContainerArgs);
};
