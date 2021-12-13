import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
import { LayersModel, ModelFitArgs } from '../MCTS/model/tf';

async function train(model: LayersModel, fitCallbacks: ModelFitArgs['callbacks']) {
    const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
    const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);

    return model.fit(xs, ys, {
        epochs: 10,
        callbacks: fitCallbacks,
    });
}

export async function watchTraining(model: LayersModel) {
    const metrics = ['loss', 'val_loss', 'acc', 'val_acc'];
    const container = {
        name: 'Model training process',
        tab: 'Training',
        styles: {
            height: '1000px',
        },
    };
    const callbacks = tfvis.show.fitCallbacks(container, metrics);

    return train(model, callbacks);
}
