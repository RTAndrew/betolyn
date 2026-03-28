import { Stack } from 'expo-router';
import React from 'react';

const CreateEventLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[eventType]" options={{ headerShown: false }} />
    </Stack>
  );
};

export default CreateEventLayout;
