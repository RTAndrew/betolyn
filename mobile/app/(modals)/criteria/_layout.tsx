import { Stack } from 'expo-router';
import React from 'react';

const CriteriaLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="[criterionId]" options={{ headerShown: false }} />
    </Stack>
  );
};

export default CriteriaLayout;
