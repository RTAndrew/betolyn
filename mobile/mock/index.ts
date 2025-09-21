import { mockData } from './matches';

const getMatches = () => {
  return mockData.matches;
};

const getMatchById = (id: number) => {
  const match = mockData.matches.find((match) => match.id === id);
  const criteria = mockData.criterias.filter((criteria) => criteria.match_id === id);

  return {
    match,
    criteria,
  };
};

const getChannels = () => {
  return mockData.channels;
};

const getChannelById = (id: number) => {
  return mockData.channels.find((channel) => channel.id === id);
};

export const mockAPI = {
  getMatches,
  getMatchById,
  getChannels,
  getChannelById,
};