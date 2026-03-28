import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Skeleton } from '@/components/skeleton';
import { colors } from '@/constants/colors';

export default function SpaceCardSkeleton() {
  return (
    <View style={styles.container}>
      <Skeleton type="circle" size={45} />

      <View style={styles.body}>
        <Skeleton type="default" style={styles.title} />
        <Skeleton type="default" style={styles.description} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  body: {
    flex: 1,
    paddingVertical: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    height: 16,
    borderBottomWidth: 0.25,
    borderColor: colors.greyLighter,
  },
  title: {
    flex: 1,
    minWidth: 0,
    maxWidth: '70%',
    height: 16,
  },
  description: {
    // flex: 1,
    width: 40,
    height: 16,
  },
});
