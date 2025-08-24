import AppHeader from '@/components/app-header';
import { Stack } from 'expo-router';
import React from 'react';

const Layout = () => {
  return (
    <>
      <AppHeader />
      <Stack screenOptions={{ headerShown: false, presentation: 'modal' }} />
      {/* <Stack.Screen name="[id]/index" options={{ presentation: "modal" }} /> */}
    </>
  );
};

export default Layout;
