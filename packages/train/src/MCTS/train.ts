import { asyncLoop } from '../utils';
import { playEpisode } from './playEpisode';
import { LayersModel, ReplayBuffer } from './model';

export interface TrainLog {
    loss: number[];
}

export interface ReplayBufferLog {
    episodes: number;
    steps: number;
}

interface TrainProps {
    epochs: number;
    episodesPerEpoch: number;
    epochsPerEpoch: number;
    stepsLimit: number;
    verbose: number;
    onTrainStart: () => void;
    onTrainEnd: () => void;
    onReplayBufferEnd: (epoch: number, log: ReplayBufferLog) => void;
    onEpochEnd: (epoch: number, log: TrainLog) => void;
}

const defaultProps: TrainProps = {
    epochs: 10,
    episodesPerEpoch: 10,
    epochsPerEpoch: 1,
    stepsLimit: 150,
    verbose: 1,
    onTrainStart: () => undefined,
    onTrainEnd: () => undefined,
    onReplayBufferEnd: () => undefined,
    onEpochEnd: () => undefined,
};

const fillReplayBuffer = async (
    model: LayersModel,
    replayBuffer: ReplayBuffer,
    props: TrainProps,
) => {
    await asyncLoop(0, props.episodesPerEpoch, async () => {
        const episode = await playEpisode(model, props.stepsLimit);
        replayBuffer.push(episode);
    });
};

export const trainNEpoch = async (
    model: LayersModel,
    replayBuffer: ReplayBuffer,
    innerProps?: Partial<TrainProps>,
) => {
    const props = { ...defaultProps, ...innerProps };
    const log: TrainLog = {
        loss: [],
    };

    props.onTrainStart();
    for (const epoch of Array(props.epochs).keys()) {
        await fillReplayBuffer(model, replayBuffer, props);
        props.onReplayBufferEnd(epoch, replayBuffer.count());

        // train on replays
        const history = await model.fitDataset(replayBuffer.getDataset(), {
            epochs: props.epochsPerEpoch,
        });
        const loss = history.history.loss.at(-1);

        log.loss.push(loss as number);
        props.onEpochEnd(epoch + 1, log);

        if (props.verbose) {
            console.log(`[${epoch + 1}] loss=${loss}`);
        }
    }
    props.onTrainEnd();
};
