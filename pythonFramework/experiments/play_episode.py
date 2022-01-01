from ..game.game_ends import isWin, isLose
from ..game.utils import moveToString


def playEpisode(
        model,
        processOneMove,
        startBoard,
        expectedBin,
        stepsLimit,
        sampler,
        verbose=False,
):
    board = startBoard
    episode = list()

    for steps in range(stepsLimit, 0, -1):
        ret = processOneMove(
            model,
            episode,
            board,
            expectedBin,
            steps,
            sampler,
            stepsLimit - steps,
        )
        score = ret['score']
        reward = ret['reward']
        isWinCondition = isWin(board, expectedBin)
        isLoseCondition = isLose(board) or score == 0

        episode.append({
            'board': board,
            'move': ret['bestMove'],
            'score': 0 if isLoseCondition else score,
            'reward': reward,
            'done': isWinCondition or isLoseCondition,
        })

        if verbose:
            currentStep = stepsLimit - steps
            win = 'win' if isWinCondition else ''
            lose = 'lose' if isLoseCondition else ''
            moveString = moveToString(board, ret['bestMove'])
            print(f'[{currentStep}] Best move is {moveString}, score is {score}, reward is {reward}, {win}{lose}')

        board = ret['nextBoard']

        if episode[-1]['done']:
            break

    return episode
