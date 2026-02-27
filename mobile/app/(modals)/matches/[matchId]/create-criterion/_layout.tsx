import { Stack } from 'expo-router';
import React from 'react';

const MatchCreateCriterionLayout = () => {
  // #region agent log
  fetch('http://127.0.0.1:7590/ingest/0b914ce6-d60f-4ff8-bc53-321981acc8f3', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': '41ee0c',
    },
    body: JSON.stringify({
      sessionId: '41ee0c',
      runId: 'initial',
      hypothesisId: 'H2',
      location: 'mobile/app/(modals)/matches/[matchId]/create-criterion/_layout.tsx:4',
      message: 'MatchCreateCriterionLayout rendered with index screen',
      data: {
        stackChildren: ['index'],
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion agent log

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
};

export default MatchCreateCriterionLayout;
