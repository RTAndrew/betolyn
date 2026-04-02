import { Stack } from 'expo-router';
import React from 'react';

const MatchModalLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="create-event" options={{ headerShown: false }} />
      <Stack.Screen name="fund" options={{ headerShown: false }} />
    </Stack>
  );
};

export default MatchModalLayout;
