import React from 'react';
import { View } from 'react-native';

import SafeHorizontalView from '@/components/safe-horizontal-view';
import { Skeleton } from '@/components/skeleton';

import { styles } from './styles';

export function SingleBetCardHistorySkeleton() {
  return (
    <SafeHorizontalView style={[styles.card]}>
      <View style={[styles.logos, { gap: 4 }]}>
        <Skeleton type="circle" size={32} />
        <Skeleton type="circle" size={32} />
      </View>

      <View style={styles.body}>
        <Skeleton type="default" borderRadius={4} style={{ width: '80%', height: 14 }} />
        <Skeleton
          type="default"
          borderRadius={4}
          style={{ width: '60%', height: 14, marginTop: 6 }}
        />
      </View>

      <View style={styles.footer}>
        <Skeleton type="default" borderRadius={4} style={{ width: 48, height: 14 }} />
        <Skeleton type="default" borderRadius={4} style={{ width: 64, height: 14, marginTop: 6 }} />
      </View>
    </SafeHorizontalView>
  );
}
