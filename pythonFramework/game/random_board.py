import numpy as np
from copy import deepcopy

from .constants import DECK, EMPTY


def randomBoard():
    deck = deepcopy(DECK)
    np.random.shuffle(deck)
    numColumns = 8
    layout = np.full([23, numColumns], EMPTY).tolist()

    level = 1  # level === 0 is place & bin
    while len(deck) > 0:
        for column in range(numColumns):
            try:
                layout[level][column] = deck.pop()
            except:
                pass
            finally:
                pass

        level += 1

    return layout
