import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
import { showModel } from './inference';

import { createModel, oheLength } from './MCTS';

import './index.scss';

type ExtWindow = typeof window & {
    tf: typeof tf;
    tfvis: typeof tfvis;
};

(window as ExtWindow).tf = tf;
(window as ExtWindow).tfvis = tfvis;

// Define a model for linear regression.
// const model = tf.sequential();
// model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
// model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });
const xBoardShape = [8, 46, oheLength];
const model = createModel(xBoardShape);

showModel(model);

document
    .querySelector('#show-visor')
    .addEventListener('click', async () => tfvis.visor().toggle());
// document
//     .querySelector('#train-model')
//     .addEventListener('click', async () => watchTraining(model));

//
// playEpisode(model, 200);
