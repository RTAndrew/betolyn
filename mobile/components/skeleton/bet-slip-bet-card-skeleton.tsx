import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/colors';

import { Skeleton } from './index';

export function BetSlipBetCardSkeleton({ border = true }: { border?: boolean }) {
  return (
    <View style={[styles.root, border && styles.border]}>
      <View style={styles.left}>
        <Skeleton type="default" borderRadius={4} style={styles.oddName} />
        <Skeleton type="default" borderRadius={4} style={styles.criterionName} />
      </View>
      <View style={styles.right}>
        <Skeleton type="default" borderRadius={4} style={styles.valueLine} />
        <Skeleton type="default" borderRadius={4} style={styles.stakeLine} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: colors.greyLight,
  },
  left: {
    flex: 1,
    gap: 4,
  },
  oddName: {
    width: '70%',
    height: 16,
  },
  criterionName: {
    width: 100,
    height: 12,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  valueLine: {
    width: 36,
    height: 14,
  },
  stakeLine: {
    width: 48,
    height: 16,
  },
});
