from .utils import getFinalScore


class ReplayBuffer:
    def __init__(self, length, batchSize, leftEpisodesAfterOverflow=None):
        self.length = 0
        self.episodeLength = length
        self.batchSize = batchSize
        self.leftEpisodesAfterOverflow = leftEpisodesAfterOverflow or length
        self._data = list()

    def count(self):
        return {
            'episodes': len(self._data),
            'steps': self.length,
        }

    def _updateLength(self):
        self.length = sum(map(lambda episode: len(episode), self._data))

    def push(self, episode):
        if len(episode) > 0:
            self._data.append(episode)
            self._data.sort(key=lambda x: getFinalScore(x, -2))
            self.length += len(episode)

        if len(self._data) > self.episodeLength:
            sliceLength = self.leftEpisodesAfterOverflow or self.episodeLength
            self._data = self._data[0:sliceLength]
            self._updateLength()

    def getDataset(self):
        raise Exception('getDataset is not implemented')
