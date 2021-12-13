import { playEpisode } from './playEpisode';
import { LayersModel, ReplayBuffer } from './model';

interface TrainProps {
    epochs: number;
    episodes_per_epoch: number;
    epochs_per_epoch: number;
    stepsLimit: number;
}

const defaultProps: TrainProps = {
    epochs: 10,
    episodes_per_epoch: 10,
    epochs_per_epoch: 1,
    stepsLimit: 150,
};

export const trainNEpoch = (
    model: LayersModel,
    replayBuffer: ReplayBuffer,
    innerProps: TrainProps,
) => {
    const props = { ...innerProps, ...defaultProps };

    for (const epoch of Array(props.epochs).keys()) {
        // fill replay buffer
        for (const _ of Array(props.episodes_per_epoch).keys()) {
            const episode = playEpisode(model, props.stepsLimit);
            replayBuffer.push(episode);
        }
        // train on replays
        // TODO: history = model.fit(epochs=props.epochs_per_epoch);
        const loss = 0;
        console.log(`[${epoch + 1}] loss=${loss}`);
    }
};
