import { tf } from '../MCTS';

const backends = ['cpu', 'webgl'];
let backendIndex = 1;
const template = () => `Toggle backend to ${backends[backendIndex]}`;

export const toggleBackend = async () => {
    backendIndex = (backendIndex + 1) % 2;
    await tf.setBackend(backends[backendIndex]);
};
export const initToggleBackendButton = () => {
    const button = document.querySelector('#toggle-backend');

    button.innerHTML = template();
    button.addEventListener('click', async (e) => {
        await toggleBackend();
        (e.currentTarget as HTMLDivElement).innerText = template();
    });
};
