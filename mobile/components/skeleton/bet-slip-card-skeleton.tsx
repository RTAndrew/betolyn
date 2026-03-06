import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/colors';

import { BetSlipBetCardSkeleton } from './bet-slip-bet-card-skeleton';
import { Skeleton } from './index';

export function BetSlipCardSkeleton({ betCount = 2 }: { betCount?: number } = {}) {
  return (
    <View style={styles.root}>
      <View style={styles.smallCard}>
        <Skeleton type="circle" size={30} />
        <Skeleton type="default" borderRadius={4} style={styles.teamName} />
        <Skeleton type="default" borderRadius={4} style={styles.score} />
        <Skeleton type="circle" size={30} />
        <Skeleton type="default" borderRadius={4} style={styles.teamName} />
      </View>

      <View style={styles.body}>
        <Skeleton.Group count={betCount} gap={0}>
          <BetSlipBetCardSkeleton border />
        </Skeleton.Group>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {},
  smallCard: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: colors.greyDark,
  },
  teamName: {
    width: 48,
    height: 12,
  },
  score: {
    width: 28,
    height: 12,
    marginHorizontal: 4,
  },
  body: {
    flexDirection: 'column',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: colors.greyMedium,
  },
});
