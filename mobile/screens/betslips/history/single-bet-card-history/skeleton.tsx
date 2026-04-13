import React from 'react';
import { View } from 'react-native';

import SafeHorizontalView from '@/components/safe-horizontal-view';
import { Skeleton } from '@/components/skeleton';

import { styles } from './styles';

export function SingleBetCardHistorySkeleton() {
  return (
    <SafeHorizontalView style={[styles.card]}>
      <View style={styles.headerRow}>
        <Skeleton type="default" borderRadius={12} style={{ width: 74, height: 24 }} />
        <Skeleton type="default" borderRadius={4} style={{ width: 122, height: 34 }} />
      </View>

      <View style={styles.contentRow}>
        <View style={styles.body}>
          <Skeleton type="default" borderRadius={4} style={{ width: '82%', height: 22 }} />
          <Skeleton type="default" borderRadius={4} style={{ width: '68%', height: 20 }} />
        </View>
        <View style={styles.footer}>
          <Skeleton type="default" borderRadius={4} style={{ width: 150, height: 24 }} />
        </View>
      </View>
    </SafeHorizontalView>
  );
}
