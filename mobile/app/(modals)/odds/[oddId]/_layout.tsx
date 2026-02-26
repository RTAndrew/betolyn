import { Stack } from 'expo-router';
import React from 'react';

const OddIdLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="settings/index" options={{ headerShown: false }} />
    </Stack>
  );
};

export default OddIdLayout;
