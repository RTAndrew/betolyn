import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/colors';

import SafeHorizontalView from '../safe-horizontal-view';
import { Skeleton } from '../skeleton';

const ITEM_PADDING_V = 12;
const BORDER_RADIUS = 12;

function SettingsGroupSkeletonRow() {
  return (
    <SafeHorizontalView style={styles.item}>
      <Skeleton type="default" borderRadius={4} style={styles.titleLine} />
      <Skeleton type="default" borderRadius={4} style={styles.subtitleLine} />
    </SafeHorizontalView>
  );
}

export function SettingsGroupSkeleton({ count = 4 }: { count?: number }) {
  return (
    <View style={styles.group}>
      {Array.from({ length: count }).map((_, index) => (
        <SettingsGroupSkeletonRow key={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: 12,
    overflow: 'hidden',
    borderRadius: BORDER_RADIUS,
    backgroundColor: colors.greyLight,
  },
  item: {
    gap: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
    paddingVertical: ITEM_PADDING_V,
  },
  titleLine: {
    width: 170,
    flexGrow: 0,
  },
  subtitleLine: {
    width: 100,
    marginTop: 4,
    flexGrow: 0,
  },
});
