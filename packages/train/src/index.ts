import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
import {
    showModel,
    toggleBackend,
    initToggleBackendButton,
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

let model = createModel(xShape);
const replayBuffer = new ReplayBuffer(10, 32, 1, 10);

window.onload = async () => {
    await toggleBackend();
    await showModel(model);

    initToggleBackendButton();
    initTogglePanelButton();

    document.querySelector('#train-model').addEventListener('click', async (event) => {
        console.log('Train started');

        const button = event.currentTarget as HTMLButtonElement;
        const epochs = 10;
        const status = document.querySelector('#train-status');
        const progressTitle = document.querySelector('#train-progress-title');
        const progressBar = document.querySelector('#train-progress-bar-inner');
        const setProgress = (epoch: number) => {
            progressTitle.innerHTML = `${epoch} of ${epochs}`;
            (progressBar as HTMLDivElement).style.width = `${(100 * epoch) / epochs}%`;
        };

        button.disabled = true;
        model.compile({ loss: 'meanSquaredError', optimizer: 'adam' });
        await trainNEpoch(model, replayBuffer, {
            epochs,
            episodesPerEpoch: 5,
            epochsPerEpoch: 1,
            stepsLimit: 150,
            verbose: 1,
            onTrainStart: async () => {
                setProgress(0);
                await showPanel();
                await drawTrainLog({ loss: [] });
                status.innerHTML = 'Filling replay buffer...';
            },
            onReplayBufferEnd: () => {
                status.innerHTML = 'Training model...';
            },
            onEpochEnd: async (epoch, log) => {
                setProgress(epoch);
                await drawTrainLog(log);
                status.innerHTML = 'Filling replay buffer...';
            },
            onTrainEnd: () => {
                status.innerHTML = 'Model trained';
            },
        });
        button.disabled = false;

        console.log('Train ended');
    });

    document.querySelector('#download-model').addEventListener('click', async () => {
        await model.save('downloads://soliter-model');
    });
    document.querySelector('#load-model').addEventListener('click', async (event) => {
        const jsonUpload = document.getElementById('json-upload') as HTMLInputElement;
        const weightsUpload = document.getElementById(
            'weights-upload',
        ) as HTMLInputElement;
        const button = event.currentTarget as HTMLButtonElement;
        const result = document.getElementById('load-model-result');

        button.disabled = true;
        result.innerText = 'Loading...';
        model = await tf.loadLayersModel(
            tf.io.browserFiles([jsonUpload.files[0], weightsUpload.files[0]]),
        );
        await showModel(model);
        button.disabled = false;
        result.innerText = 'Loaded';
    });
};
