def getLastBinFromEpisode(episode):
    return episode[-1]['board'][4:]


def getFinalScore(episode, at):
    return episode[at]['score']


def getNoMovesReturn(board):
    return {
        'score': 0,
        'reward': -1,
        'bestMove': [
            [0, 0],
            [0, 0],
        ],
        'nextBoard': board
    }
