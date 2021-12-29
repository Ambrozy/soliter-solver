export const asyncLoop = (
    start: number,
    end: number,
    loopFunction: (index: number) => Promise<void>,
) => {
    const sign = Math.sign(end - start);
    let iteration = start;

    const loop = (resolve: () => void, reject: () => void) => {
        setTimeout(async () => {
            if (sign > 0 ? iteration < end : iteration > end) {
                try {
                    await loopFunction(iteration);
                } catch (error) {
                    if (error instanceof Error) {
                        throw error;
                    }
                    return reject();
                }

                iteration += sign;
                loop(resolve, reject);
            } else {
                resolve();
            }
        }, 0);
    };

    return new Promise<void>(loop);
};
