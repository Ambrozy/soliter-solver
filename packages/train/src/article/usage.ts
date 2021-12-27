import { randomBoard } from '../game';
import { solveEpisode } from '../MCTS';
import { LayersModel } from '../MCTS/model';
import { prettifyCards } from '../utils';
import { parseEditor } from './editor';

export const initUsage = (model: LayersModel) => {
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

        const history = await solveEpisode(model, board, expectedBin, 120);
        resultContainer.innerHTML = 'Solved: ' + prettifyCards(history.join(', '));
    });
};
