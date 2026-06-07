import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Settings } from '@/components/settings';

import { MetricsBlockSkeleton, MetricsBlockSkeletonProps } from './metrics-block-skeleton';

export function SettingsScreenSkeleton({ variant = 'match' }: MetricsBlockSkeletonProps) {
  return (
    <View style={styles.content}>
      <View style={styles.metricsWrap}>
        <MetricsBlockSkeleton variant={variant} />
      </View>

      <Settings.Skeleton count={3} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 18,
  },
  metricsWrap: {
    marginBottom: 8,
  },
});
