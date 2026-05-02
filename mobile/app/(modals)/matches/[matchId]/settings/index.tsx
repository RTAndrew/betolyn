import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import MatchSettingsScreen from '@/screens/matches/settings';

const MatchSettings = () => {
  const { matchId } = useLocalSearchParams();

  return <MatchSettingsScreen matchId={matchId as string} />;
};

export default MatchSettings;
