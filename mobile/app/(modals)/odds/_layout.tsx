import { Stack } from 'expo-router';
import React from 'react';

const OddsLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="[oddId]" options={{ headerShown: false }} />
    </Stack>
  );
};

export default OddsLayout;
