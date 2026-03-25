import { Stack } from 'expo-router';
import React from 'react';

const SpacesLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="create" options={{ headerShown: false }} />
    </Stack>
  );
};

export default SpacesLayout;
