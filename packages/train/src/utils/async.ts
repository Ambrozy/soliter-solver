export const asyncLoop = <T>(
    start: number,
    end: number,
    loopFunction: (index: number) => Promise<T>,
) => {
    const sign = Math.sign(end - start);
    const result: T[] = [];
    let iteration = start;

    const loop = (resolve: (value: T[]) => void) => {
        setTimeout(async () => {
            if (sign > 0 ? iteration < end : iteration > end) {
                try {
                    const iterationResult = await loopFunction(iteration);
                    if (iterationResult !== undefined) {
                        result.push(iterationResult);
                    }
                } catch (iterationResult) {
                    if (iterationResult !== undefined) {
                        result.push(iterationResult);
                    }
                    resolve(result);
                }

                iteration += sign;
                loop(resolve);
            } else {
                resolve(result);
            }
        }, 0);
    };

    return new Promise<T[]>((resolve) => {
        loop(resolve);
    });
};
