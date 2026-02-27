import { Stack } from 'expo-router';
import React from 'react';

const MatchesFormSheetLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="[matchId]" options={{ headerShown: false }} />
    </Stack>
  );
};

export default MatchesFormSheetLayout;
