import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';

import SpaceGuard from '@/components/space-guard';

const CreateEventLayout = () => {
  const { id } = useLocalSearchParams();
  const spaceId = id as string;

  return (
    <SpaceGuard
      spaceId={spaceId}
      title="Apenas administradores podem criar eventos"
      description="Não tem permissão para criar um evento neste espaço."
    >
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="[eventType]" options={{ headerShown: false }} />
      </Stack>
    </SpaceGuard>
  );
};

export default CreateEventLayout;
