import { LayersModel } from '@tensorflow/tfjs-layers';
import { randomBoard } from '../game';
import { solveEpisode } from '../experiments/common';
import { ProcessOneMoveType } from '../experiments/common/types';
import { prettifyCards } from '../utils';
import { parseEditor } from './editor';

export const initUsage = (model: LayersModel, processOneMove: ProcessOneMoveType) => {
    document.querySelector('#inference-model').addEventListener('click', async () => {
        const resultContainer = document.querySelector('#solver-result');
        let board = randomBoard();
        let expectedBin = ['Kk', 'Kp', 'Kc', 'u'];

        try {
            resultContainer.innerHTML = 'Solving...';
            resultContainer.classList.remove('red');
            ({ expectedBin, board } = await parseEditor());
        } catch (errorText) {
            resultContainer.innerHTML = errorText;
            resultContainer.classList.add('red');
            return;
        }

        const history = await solveEpisode(
            model,
            processOneMove,
            board,
            expectedBin,
            120,
        );
        resultContainer.innerHTML = 'Solved: ' + prettifyCards(history.join(', '));
    });
};
