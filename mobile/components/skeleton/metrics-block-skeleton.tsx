import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Skeleton } from './index';

export type MetricsBlockSkeletonVariant = 'match' | 'criterion';

export interface MetricsBlockSkeletonProps {
  variant?: MetricsBlockSkeletonVariant;
}

export function MetricsBlockSkeleton({ variant = 'match' }: MetricsBlockSkeletonProps) {
  return (
    <View style={styles.container}>
      {variant === 'match' ? (
        <Skeleton type="circle" size={220} />
      ) : (
        <View style={styles.progressBarWrap}>
          <Skeleton borderRadius={8} style={styles.progressBar} />
        </View>
      )}

      <View style={styles.stats}>
        <Skeleton.Group count={3} gap={32} style={styles.stats}>
          <View style={styles.stat}>
            <Skeleton borderRadius={4} style={styles.statDescription} />
            <Skeleton borderRadius={4} style={styles.statTitle} />
          </View>
        </Skeleton.Group>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
    marginTop: 38,
    marginBottom: 18,
  },
  progressBarWrap: {
    width: '100%',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    width: '100%',
    height: 12,
  },
  progressLabel: {
    width: 180,
    height: 14,
  },
  riskLabel: {
    width: 120,
    height: 14,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
  },
  stat: {
    alignItems: 'center',
    gap: 4,
  },
  statDescription: {
    width: 80,
    height: 14,
  },
  statTitle: {
    width: 36,
    height: 10,
  },
});
