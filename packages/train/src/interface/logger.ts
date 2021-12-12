const loggerWrapper = document.getElementsByClassName('logger')[0];

type logArgs = string | number | object;

const log = (logLevel: 'log' | 'warn' | 'error', ...args: logArgs[]) => {
    const logElement = document.createElement('div');
    const strArgs = args.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg)));

    logElement.classList.add('log-item');
    logElement.classList.add(logLevel);
    logElement.innerHTML = strArgs.join(' ');
    loggerWrapper.appendChild(logElement);
    console[logLevel](...args);
};

export const logger = {
    log: (...args: logArgs[]) => log('log', ...args),
    warn: (...args: logArgs[]) => log('warn', ...args),
    error: (...args: logArgs[]) => log('error', ...args),
};
