from .utils import getFinalScore


class ReplayBuffer:
    def __init__(self, length, batchSize, leftEpisodesAfterOverflow=None):
        self.length = 0
        self.episodeLength = length
        self.batchSize = batchSize
        self.leftEpisodesAfterOverflow = leftEpisodesAfterOverflow or length
        self.__data = list()

    def count(self):
        return {
            'episodes': len(self.__data),
            'steps': self.length,
        }

    def __updateLength(self):
        self.length = sum(map(lambda episode: len(episode), self.__data))

    def push(self, episode):
        if len(episode) > 0:
            self.__data.append(episode)
            self.__data.sort(key=lambda x: getFinalScore(x, -2))
            self.length += len(episode)

        if len(self.__data) > self.episodeLength:
            sliceLength = self.leftEpisodesAfterOverflow or self.episodeLength
            self.__data = self.__data[0:sliceLength]
            self.__updateLength()

    def getDataset(self):
        raise Exception('getDataset is not implemented')
