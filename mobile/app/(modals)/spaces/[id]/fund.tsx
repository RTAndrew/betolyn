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
      title="Only admins can allocate funds"
      description="You do not have permission to allocate funds in this space."
    >
      <AllocateFundsScreen />
    </SpaceGuard>
  );
};

export default AllocateFunds;
