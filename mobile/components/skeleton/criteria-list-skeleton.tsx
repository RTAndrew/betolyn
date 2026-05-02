import React from 'react';
import { StyleSheet } from 'react-native';

import SafeHorizontalView from '../safe-horizontal-view';
import { Settings } from '../settings';
import { Skeleton } from './index';

const ITEM_PADDING_V = 12;

function CriteriaListSkeletonRow() {
  return (
    <SafeHorizontalView style={styles.item}>
      <Skeleton type="default" borderRadius={4} style={styles.titleLine} />
      <Skeleton type="default" borderRadius={4} style={styles.subtitleLine} />
    </SafeHorizontalView>
  );
}

export function CriteriaListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <Settings.ItemGroup style={styles.group}>
      {Array.from({ length: count }).map((_, index) => (
        <CriteriaListSkeletonRow key={index} />
      ))}
    </Settings.ItemGroup>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: 12,
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
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  descriptionLine: {
    width: 32,
    height: 18,
  },
  arrow: {
    width: 10,
    height: 10,
  },
});
