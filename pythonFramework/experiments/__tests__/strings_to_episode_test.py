from pythonFramework.experiments.replays import REPLAYS
from pythonFramework.experiments.strings_to_episode import stringsToEpisode


def test_stringsToEpisode():
    episode = stringsToEpisode(REPLAYS[0]['startBoard'], REPLAYS[0]['history'])
    assert len(episode) == 96, 'reproduced episode length should be correct'
