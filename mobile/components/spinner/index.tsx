import React, { useMemo } from 'react';
import { ActivityIndicator, ActivityIndicatorProps, Platform } from 'react-native';

import FullScreenCentered, { FullScreenCenteredProps } from '@/components/full-screen-centered';
import { colors } from '@/constants/colors';

export type SpinnerProps = ActivityIndicatorProps & {
  fullScreen?: boolean;
  containerProps?: FullScreenCenteredProps;
};

export function Spinner({
  fullScreen,
  color = colors.white,
  containerProps,
  ...activityProps
}: SpinnerProps) {
  const size = useMemo(() => {
    // Only Android handles "number" sizes
    if (fullScreen && Platform.OS === 'android') return 72;
    return activityProps.size ?? 'large';
  }, [fullScreen, activityProps.size]);

  const indicator = <ActivityIndicator {...activityProps} size={size} color={color} />;

  if (fullScreen) {
    return <FullScreenCentered {...containerProps}>{indicator}</FullScreenCentered>;
  }

  return indicator;
}
