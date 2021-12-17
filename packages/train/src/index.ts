import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
import {
    showModel,
    toggleBackend,
    initToggleBackendButton,
    togglePanel,
    initTogglePanelButton,
} from './interface';
import { createModel, xShape, playEpisode } from './MCTS';

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

window.onload = async () => {
    console.log('onLoad');

    const model = createModel(xShape);

    await toggleBackend();
    await togglePanel();
    await showModel(model);

    document.querySelector('#backend').innerHTML = tf.getBackend();
    initToggleBackendButton();
    initTogglePanelButton();

    const episode = playEpisode(model, 10);
    console.log('episode', episode);
};

// document
//     .querySelector('#train-model')
//     .addEventListener('click', async () => watchTraining(model));
