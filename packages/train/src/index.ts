import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
import {
    showModel,
    toggleBackend,
    initToggleBackendButton,
    initTogglePanelButton,
    drawTrainLog,
    showPanel,
    initIO,
    initEditor,
} from './interface';
import { randomBoard } from './game';
import { createModel, xShape, ReplayBuffer, solveEpisode, trainNEpoch } from './MCTS';

import './index.scss';

type ExtWindow = typeof window & {
    tf: typeof tf;
    tfvis: typeof tfvis;
};

(window as ExtWindow).tf = tf;
(window as ExtWindow).tfvis = tfvis;

let model = createModel(xShape);
const replayBuffer = new ReplayBuffer(10, 32, 1, 10);

window.onload = async () => {
    await toggleBackend();
    await showModel(model);

    initToggleBackendButton();
    initTogglePanelButton();
    initIO(model, (loadedModel) => {
        model = loadedModel;
    });
    initEditor();

    document.querySelector('#inference-model').addEventListener('click', async () => {
        const resultContainer = document.querySelector('#solver-result');
        const boardLayout = document.querySelector(
            '.prism-live textarea',
        ) as HTMLInputElement;

        resultContainer.innerHTML = 'Solving...';
        const board = randomBoard();

        try {
            board.layout = JSON.parse(boardLayout.value);
        } catch (_) {
            resultContainer.innerHTML = 'Board layout is not readable. Check the syntax';
            return;
        }

        const history = await solveEpisode(model, 150, board);
        resultContainer.innerHTML = history
            .join(', ')
            .replace(/([0-9JQKA])p/g, '$1<span class="black">&#9824;</span>')
            .replace(/([0-9JQKA])c/g, '$1<span class="red">&#9829;</span>')
            .replace(/([0-9JQKA])k/g, '$1<span class="black">&#9827;</span>')
            .replace(/([0-9JQKA])b/g, '$1<span class="red">&#9830;</span>');
    });
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
};
