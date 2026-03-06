import React from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';

import { Skeleton } from './index';

export interface OddButtonSkeletonProps {
  style?: StyleProp<ViewStyle>;
}

export function OddButtonSkeleton({ style }: OddButtonSkeletonProps) {
  const flattenedStyle = style != null ? StyleSheet.flatten([styles.button, style]) : styles.button;
  return <Skeleton type="default" borderRadius={100} style={flattenedStyle} />;
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    minWidth: 56,
    minHeight: 36,
  },
});
