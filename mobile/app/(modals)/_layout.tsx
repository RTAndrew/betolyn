import { Stack } from 'expo-router';
import React from 'react';

const ModalsLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="me" options={{ headerShown: false }} />
      <Stack.Screen name="spaces" options={{ headerShown: false }} />
      <Stack.Screen name="matches" options={{ headerShown: false }} />
      <Stack.Screen name="betslips" options={{ headerShown: false }} />
      <Stack.Screen name="criteria" options={{ headerShown: false }} />
      <Stack.Screen name="odds" options={{ headerShown: false }} />
      <Stack.Screen name="transactions" options={{ headerShown: false }} />
    </Stack>
  );
};

export default ModalsLayout;
