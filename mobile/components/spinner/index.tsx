import React from 'react';
import { ActivityIndicator, ActivityIndicatorProps } from 'react-native';

import FullScreenCentered from '@/components/full-screen-centered';
import { colors } from '@/constants/colors';

export type SpinnerProps = ActivityIndicatorProps & {
  fullScreen?: boolean;
};

export function Spinner({ fullScreen, color = colors.white, ...activityProps }: SpinnerProps) {
  const indicator = <ActivityIndicator color={color} {...activityProps} />;

  if (fullScreen) {
    return <FullScreenCentered>{indicator}</FullScreenCentered>;
  }

  return indicator;
}
