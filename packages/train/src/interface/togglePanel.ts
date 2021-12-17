import * as tfvis from '@tensorflow/tfjs-vis';

const template = () => `${tfvis.visor().isOpen() ? 'Hide' : 'Show'} panel`;

export const togglePanel = async () => {
    await tfvis.visor().toggle();
};
export const initTogglePanelButton = () => {
    const button = document.querySelector('#toggle-visor');

    button.innerHTML = template();
    button.addEventListener('click', async (e) => {
        await togglePanel();
        (e.currentTarget as HTMLDivElement).innerText = template();
    });
};
