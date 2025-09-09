import { mockData } from './matches';

const getMatches = () => {
  return mockData.matches;
}


const getMatchById = (id: number) => {
  const match = mockData.matches.find((match) => match.id === id);
  const criteria = mockData.criterias.filter((criteria) => criteria.match_id === id);

  return {
    match,
    criteria,
  }
}







export const mockAPI = {
  getMatches,
  getMatchById,
}