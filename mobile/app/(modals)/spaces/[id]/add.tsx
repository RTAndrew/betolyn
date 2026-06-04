import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import ChannelAddMembers from '@/screens/spaces/[id]/channel-add-members';

const SpaceAddMembers = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <ChannelAddMembers spaceId={id} />;
};

export default SpaceAddMembers;
