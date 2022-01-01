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
// import { processOneMove } from './experiments/greedAlgorithm';
// import { createModel, ReplayBuffer } from './experiments/stepEvaluationScore';
import {
    createModel,
    ReplayBuffer,
    processOneMove,
} from './experiments/stepEvaluationReward';

import './index.scss';

let model = createModel();
const replayBuffer = new ReplayBuffer({
    length: 18,
    batchSize: 128,
    leftEpisodesAfterOverflow: 17,
    gamma: 0.99,
});
const epochs = 20;

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
    // await solveEpisode(
    //     null,
    //     getReplayProcessOneMove(replays[1]),
    //     randomBoard(),
    //     ['Kp', 'Kc', 'Kk', 'Kb'],
    //     120,
    //     true,
    // );
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

    const progressTitle = document.querySelector('#train-progress-title');
    const progressBar = document.querySelector('#train-progress-bar-inner');
    const setProgress = (epoch: number) => {
        progressTitle.innerHTML = `${epoch} of ${epochs}`;
        (progressBar as HTMLDivElement).style.width = `${(100 * epoch) / epochs}%`;
    };
    setProgress(0);

    // training
    document.querySelector('#train-model').addEventListener('click', async (event) => {
        console.log('Train started');

        const button = event.currentTarget as HTMLButtonElement;
        const status = document.querySelector('#train-status');

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
