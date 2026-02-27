import { Stack } from 'expo-router';
import React from 'react';

const FormSheetLayout = () => {
  return (
    <Stack>
      {/* <Stack.Screen name="index" options={{ headerShown: false }} /> */}
      <Stack.Screen name="settings" options={{ headerShown: false }} />
      <Stack.Screen name="create-criterion" options={{ headerShown: false }} />
    </Stack>
  );
};

export default FormSheetLayout;
