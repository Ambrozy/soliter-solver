import * as tfvis from '@tensorflow/tfjs-vis';

const template = () => `${tfvis.visor().isOpen() ? 'Hide' : 'Show'} panel`;
let button: HTMLDivElement;

export const togglePanel = async () => {
    await tfvis.visor().toggle();
    if (button) {
        button.innerHTML = template();
    }
};
export const showPanel = async () => {
    await tfvis.visor().open();
    if (button) {
        button.innerHTML = template();
    }
};
export const initTogglePanelButton = () => {
    button = document.querySelector('#toggle-visor');
    button.innerHTML = template();
    button.addEventListener('click', async () => {
        await togglePanel();
    });
};
