import { TrainLog } from '../MCTS/train';
import * as tfvis from '@tensorflow/tfjs-vis';

export const drawTrainLog = async (log: TrainLog) => {
    const surface = {
        name: 'Loss function',
        tab: 'Training',
    };
    const options = {
        xLabel: 'Epoch',
        yLabel: 'Value',
    };
    const logLoss = log.loss.map((loss, i) => ({
        x: i,
        y: loss,
    }));
    const data = {
        values: [logLoss],
        series: ['Loss'],
    };

    await tfvis.render.linechart(surface, data, options);
};
