import React from 'react';
import { StyleSheet, View } from 'react-native';

import SafeHorizontalView from '../safe-horizontal-view';
import { Settings } from '../settings';
import { Skeleton } from './index';

const ITEM_PADDING_V = 12;

function CriteriaListSkeletonRow() {
  return (
    <SafeHorizontalView style={styles.item}>
      <View style={styles.body}>
        <Skeleton type="default" borderRadius={4} style={styles.titleLine} />
        <Skeleton type="default" borderRadius={4} style={styles.subtitleLine} />
      </View>

      <View style={styles.footer}>
        <Skeleton type="default" borderRadius={4} style={styles.descriptionLine} />
      </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
    paddingVertical: ITEM_PADDING_V,
  },
  body: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  titleLine: {
    width: '70%',
    height: 16,
  },
  subtitleLine: {
    width: 100,
    height: 12,
    marginTop: 4,
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
