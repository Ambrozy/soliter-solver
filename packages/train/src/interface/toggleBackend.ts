import { tf } from '../MCTS';

const backends = ['cpu', 'webgl'];
let backendIndex = 1;
const template = () => `Toggle backend to ${backends[backendIndex]}`;
let button: HTMLDivElement;

export const toggleBackend = async () => {
    backendIndex = (backendIndex + 1) % 2;
    await tf.setBackend(backends[backendIndex]);
    if (button) {
        button.innerHTML = template();
    }
};
export const initToggleBackendButton = () => {
    button = document.querySelector('#toggle-backend');
    button.innerHTML = template();
    button.addEventListener('click', async () => {
        await toggleBackend();
    });
};
