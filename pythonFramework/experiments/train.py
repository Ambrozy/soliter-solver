import numpy as np

from .play_episode import playEpisode
from ..game.random_board import randomBoard


def noop():
    pass


def noopLog(epoch, log):
    pass


def sample(probs):
    return np.random.choice(np.arange(probs.size), p=probs)


def trainNEpoch(
        model,
        processOneMove,
        replayBuffer,
        epochs=10,
        episodesPerEpoch=10,
        epochsPerEpoch=1,
        stepsLimit=120,
        verbose=True,
        onTrainStart=noop,
        onTrainEnd=noop,
        onReplayBufferEnd=noopLog,
        onEpochEnd=noopLog,
):
    log = {
        'loss': list()
    }
    onTrainStart()

    for epoch in range(epochs):
        expectedBin = ['Kk', 'Kp', 'Kc', 'Kb']
        # fill replays
        for _ in range(episodesPerEpoch):
            episode = playEpisode(
                model,
                processOneMove,
                randomBoard(),
                expectedBin,
                stepsLimit,
                sample,
            )
            replayBuffer.push(episode)

        onReplayBufferEnd(epoch, replayBuffer.count())

        # train on replays
        history = model.fitDataset(replayBuffer.getDataset(), epochs=epochsPerEpoch)
        loss = history.history.loss[-1]
        log['loss'].append(loss)
        onEpochEnd(epoch + 1, log)

        if verbose:
            print(f'[{epoch + 1}] loss={loss:.4f}')

    onTrainEnd()
