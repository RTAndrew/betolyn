import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import NotFoundScreen from '@/app/+not-found';
import CreateEventScreen from '@/screens/spaces/[id]/create-event';
import { ESpaceCreateEventType } from '@/screens/spaces/[id]/create-event/utils';

const existsEventType = (event: string) => {
  return Object.values(ESpaceCreateEventType).includes(event as ESpaceCreateEventType);
};

export default function CreateEventLayout() {
  const { eventType } = useLocalSearchParams<{ eventType: string }>();

  if (!existsEventType(eventType)) {
    return <NotFoundScreen />;
  }

  return <CreateEventScreen type={eventType as ESpaceCreateEventType} />;
}
