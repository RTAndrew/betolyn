import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import MatchScreen from '@/screens/matches/[id]';

const MatchPage = () => {
  const { id } = useLocalSearchParams();
  return <MatchScreen matchId={id as string} />;
};

export default MatchPage;
