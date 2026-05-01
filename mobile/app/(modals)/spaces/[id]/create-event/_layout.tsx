import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';

import SpaceGuard from '@/components/space-guard';

const CreateEventLayout = () => {
  const { id } = useLocalSearchParams();
  const spaceId = id as string;

  return (
    <SpaceGuard
      spaceId={spaceId}
      title="Only admins can create events"
      description="You do not have permission to create an event in this space."
    >
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="[eventType]" options={{ headerShown: false }} />
      </Stack>
    </SpaceGuard>
  );
};

export default CreateEventLayout;
