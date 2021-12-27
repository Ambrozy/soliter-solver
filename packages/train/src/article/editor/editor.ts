import { randomBoard } from '../../game';

import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-javascript.min.js';

import '../prism-live.scss';

const initPrism = (prismId: string) => {
    const editor = document.querySelector(`#${prismId} textarea`) as HTMLInputElement;
    const visualizer = document.querySelector(`#${prismId} code`) as HTMLDivElement;

    const updateEditor = (value: string) => {
        editor.value = value;
        visualizer.innerHTML = value;
        Prism.highlightAll();
        visualizer.style.width = `${editor.scrollWidth}px`;
    };
    editor.addEventListener('input', () => updateEditor(editor.value));
    editor.addEventListener('scroll', () => {
        visualizer.style.top = `-${editor.scrollTop}px`;
        visualizer.style.left = `-${editor.scrollLeft}px`;
    });

    return updateEditor;
};

const generateBoard = () => {
    const board = randomBoard();

    return JSON.stringify(board)
        .replace(/(],)/gi, '$1\n')
        .replace(/(\[)(\[)/gi, '$1\n$2')
        .replace(/(])(])/gi, '$1\n$2');
};

export const initEditor = () => {
    const updateBin = initPrism('bin-prism');
    const updateBoard = initPrism('board-prism');
    const expectedBin = JSON.stringify(['Kk', 'Kp', 'Kc', 'u']);
    const startBoard = generateBoard();

    updateBin(expectedBin);
    updateBoard(startBoard);

    document
        .querySelector('#random-board')
        .addEventListener('click', () => updateBoard(generateBoard()));
};
