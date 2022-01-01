import numpy as np

from .play_episode import playEpisode
from .utils import getLastBinFromEpisode
from ..game.utils import moveToString


def solveEpisode(
        model,
        processOneMove,
        startBoard,
        expectedBin,
        stepsLimit,
        verbose=False
):
    episode = playEpisode(
        model,
        processOneMove,
        startBoard,
        expectedBin,
        stepsLimit,
        np.argmax,
        verbose,
    )
    finalBin = getLastBinFromEpisode(episode)
    history = list(map(lambda step: moveToString(step['board'], step['move']), episode))

    return [history, finalBin]
