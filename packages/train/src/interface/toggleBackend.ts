import { tf } from '../MCTS';

let isCPU = false;
const template = () => `Toggle backend to ${isCPU ? 'webgl' : 'cpu'}`;
let button: HTMLDivElement;
let title: HTMLDivElement;

export const toggleBackend = async () => {
    isCPU = !isCPU;
    await tf.setBackend(isCPU ? 'cpu' : 'webgl');
    if (button) {
        button.innerHTML = template();
        title.innerHTML = tf.getBackend();
    }
};
export const initToggleBackendButton = () => {
    title = document.querySelector('#backend');
    title.innerHTML = tf.getBackend();
    isCPU = tf.getBackend() === 'cpu';
    button = document.querySelector('#toggle-backend');
    button.innerHTML = template();
    button.addEventListener('click', async () => {
        await toggleBackend();
    });
};
