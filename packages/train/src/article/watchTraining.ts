import * as tfvis from '@tensorflow/tfjs-vis';
import { ReplayBuffer, TrainLog } from '../MCTS';

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

export const drawReplayBuffer = async (replayBuffer: ReplayBuffer) => {
    const headers = ['Index', 'Bin', 'Score', 'Step'];
    const values = replayBuffer.getStatistics();
    const surface = { name: 'Replay Buffer Summary', tab: 'Replay Buffer' };

    await tfvis.render.table(surface, { headers, values });
};
