import * as tf from '@tensorflow/tfjs';
import { drawHistory } from './interface/historyCurve';
// import './interface/historyCurve';
import { logger } from './interface/logger';

import './index.scss';

// Define a model for linear regression.
const model = tf.sequential();

model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

async function train(xs: tf.Tensor2D, ys: tf.Tensor2D, epochs: number) {
    const history = await model.fit(xs, ys, { epochs });

    // Use the model to do inference on a data point the model hasn't seen before:
    const result = model.predict(tf.tensor2d([5], [1, 1]));

    // Open the browser devtools to see the output
    logger.log(result.toString());

    drawHistory(history.history as Record<string, number[]>);
}

// Generate some synthetic data for train.
const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);

// Train the model using the data.
train(xs, ys, 10);

logger.log('Start');

try {
    logger.log('End with result:', 0);
} catch (e) {
    logger.error(e);
    throw e;
}
