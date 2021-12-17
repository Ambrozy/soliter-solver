import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
import {
    showModel,
    toggleBackend,
    initToggleBackendButton,
    togglePanel,
    initTogglePanelButton,
    drawTrainLog,
    showPanel,
} from './interface';
import { createModel, xShape, ReplayBuffer } from './MCTS';
import { trainNEpoch } from './MCTS/train';

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

const model = createModel(xShape);
const replayBuffer = new ReplayBuffer(10, 32, 1, 10);
model.compile({ loss: 'meanSquaredError', optimizer: 'adam' });

window.onload = async () => {
    await toggleBackend();
    await togglePanel();
    await showModel(model);

    document.querySelector('#backend').innerHTML = tf.getBackend();
    initToggleBackendButton();
    initTogglePanelButton();
};

document.querySelector('#train-model').addEventListener('click', async () => {
    console.log('Train started');

    await showPanel();
    await drawTrainLog({ loss: [] });
    await trainNEpoch(model, replayBuffer, {
        epochs: 10,
        episodesPerEpoch: 5,
        epochsPerEpoch: 1,
        stepsLimit: 150,
        verbose: 1,
        onEpochEnd: (_, log) => drawTrainLog(log),
    });

    console.log('Train ended');
});
