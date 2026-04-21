import React from 'react';
import { SheetProps } from 'react-native-actions-sheet';

import MatchScreen from '@/screens/matches/[id]';

const MatchGlobalSheet = ({ payload }: SheetProps<'match'>) => {
  if (!payload?.matchId) throw new Error('Match ID is required to show match screen');

  return <MatchScreen matchId={payload.matchId} />;
};

export default MatchGlobalSheet;
