import React from 'react';
import { View } from 'react-native';

import SafeHorizontalView from '@/components/safe-horizontal-view';
import { Skeleton } from '@/components/skeleton';

import { styles } from './styles';

export function BetSlipItemCardSkeleton() {
  return (
    <SafeHorizontalView style={[styles.card]}>
      <View style={{ flexDirection: 'row', gap: 12, justifyContent: 'space-between' }}>
        <Skeleton type="default" size={100} style={{ flexGrow: 0 }} />
        <Skeleton type="default" size={50} style={{ flexGrow: 0 }} />
      </View>

      <View style={styles.contentRow}>
        <View style={styles.body}>
          <Skeleton type="default" size={150} style={{ flexGrow: 0 }} />
          <Skeleton type="default" size={100} style={{ flexGrow: 0 }} />
        </View>
      </View>
    </SafeHorizontalView>
  );
}
