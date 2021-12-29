import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
import {
    showModel,
    // toggleBackend,
    initToggleBackendButton,
    initTogglePanelButton,
    drawTrainLog,
    showPanel,
    initIO,
    initEditor,
    initUsage,
    drawReplayBuffer,
} from './article';
import { replays, stringsToEpisode, trainNEpoch } from './experiments/common';
// import { createModel, ReplayBuffer, processOneMove } from './experiments/segmentation';
import { createModel, ReplayBuffer, processOneMove } from './experiments/stepEvaluation';

import './index.scss';

let model = createModel();
const replayBuffer = new ReplayBuffer({
    length: 64,
    batchSize: 128,
});

type ExtWindow = typeof window & {
    tf: typeof tf;
    tfvis: typeof tfvis;
    model: typeof model;
    replayBuffer: typeof replayBuffer;
    stringsToEpisode: typeof stringsToEpisode;
};

(window as ExtWindow).tf = tf;
(window as ExtWindow).tfvis = tfvis;
(window as ExtWindow).model = model;
(window as ExtWindow).replayBuffer = replayBuffer;
(window as ExtWindow).stringsToEpisode = stringsToEpisode;

window.onload = async () => {
    replays.map((replay) => {
        replayBuffer.push(stringsToEpisode(replay.startBoard, replay.history));
    });
    await drawReplayBuffer(replayBuffer);
    // await toggleBackend();
    await showModel(model);

    initToggleBackendButton();
    initTogglePanelButton();
    initIO(model, (loadedModel) => {
        model = loadedModel;
    });
    initEditor();
    initUsage(model, processOneMove);

    // training
    document.querySelector('#train-model').addEventListener('click', async (event) => {
        console.log('Train started');

        const button = event.currentTarget as HTMLButtonElement;
        const epochs = 100;
        const status = document.querySelector('#train-status');
        const progressTitle = document.querySelector('#train-progress-title');
        const progressBar = document.querySelector('#train-progress-bar-inner');
        const setProgress = (epoch: number) => {
            progressTitle.innerHTML = `${epoch} of ${epochs}`;
            (progressBar as HTMLDivElement).style.width = `${(100 * epoch) / epochs}%`;
        };
        setProgress(0);

        button.disabled = true;
        await trainNEpoch(model, processOneMove, replayBuffer, {
            epochs,
            episodesPerEpoch: 1,
            epochsPerEpoch: 1,
            stepsLimit: 120,
            verbose: 1,
            onTrainStart: async () => {
                setProgress(0);
                await showPanel();
                await drawTrainLog({ loss: [] });
                await drawReplayBuffer(replayBuffer);
                status.innerHTML = 'Filling replay buffer...';
            },
            onReplayBufferEnd: async () => {
                await drawReplayBuffer(replayBuffer);
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
};
