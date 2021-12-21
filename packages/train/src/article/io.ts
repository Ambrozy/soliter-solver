import * as tf from '@tensorflow/tfjs';
import { LayersModel } from '../MCTS/model/tf';
import { showModel } from './showModel';

export const initIO = (model: LayersModel, onLoad: (model: LayersModel) => void) => {
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

        try {
            onLoad(
                await tf.loadLayersModel(
                    tf.io.browserFiles([jsonUpload.files[0], weightsUpload.files[0]]),
                ),
            );
            result.innerText = 'Loaded';
        } catch (_) {
            result.innerText = 'Error while loading';
        }

        await showModel(model);
        button.disabled = false;
    });
};
