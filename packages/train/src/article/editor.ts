import { randomBoard } from '../game';

import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-javascript.min.js';

import './prism-live.scss';

export const initEditor = () => {
    const editor = document.querySelector('.prism-live textarea') as HTMLInputElement;
    const visualizer = document.querySelector('.prism-live code') as HTMLDivElement;
    const updateEditor = () => {
        visualizer.innerHTML = editor.value;
        Prism.highlightAll();
        visualizer.style.width = `${editor.scrollWidth}px`;
    };
    const generateBoard = () => {
        const board = randomBoard();

        editor.value = JSON.stringify(board.layout)
            .replace(/(],)/gi, '$1\n')
            .replace(/(\[)(\[)/gi, '$1\n$2')
            .replace(/(])(])/gi, '$1\n$2');
        updateEditor();
    };

    generateBoard();
    editor.addEventListener('input', updateEditor);
    editor.addEventListener('scroll', () => {
        visualizer.style.top = `-${editor.scrollTop}px`;
        visualizer.style.left = `-${editor.scrollLeft}px`;
    });
    document.querySelector('#random-board').addEventListener('click', generateBoard);
};
