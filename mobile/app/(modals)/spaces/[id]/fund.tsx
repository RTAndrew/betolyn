import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import SpaceGuard from '@/components/space-guard';
import AllocateFundsScreen from '@/screens/spaces/allocate-funds';

const AllocateFunds = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const spaceId = id;

  return (
    <SpaceGuard
      fullScreen
      spaceId={spaceId}
      title="Apenas administradores podem alocar fundos"
      description="Não tem permissão para alocar fundos neste espaço."
    >
      <AllocateFundsScreen />
    </SpaceGuard>
  );
};

export default AllocateFunds;
