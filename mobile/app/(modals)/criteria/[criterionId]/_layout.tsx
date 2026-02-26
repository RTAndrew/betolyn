import { Stack } from 'expo-router';
import React from 'react';

const CriterionIdLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="settings/index" options={{ headerShown: false }} />
    </Stack>
  );
};

export default CriterionIdLayout;
