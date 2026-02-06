import { Stack } from 'expo-router';
import React from 'react';

const FormSheetLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="[matchId]" options={{ headerShown: false }} />
      <Stack.Screen name="[matchId]/create-criterion/index" options={{ headerShown: false }} />
    </Stack>
  );
};

export default FormSheetLayout;
