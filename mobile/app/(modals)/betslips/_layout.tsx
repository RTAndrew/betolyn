import { Stack } from 'expo-router';
import React from 'react';

const BetslipsLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="placebet" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
    </Stack>
  );
};

export default BetslipsLayout;
