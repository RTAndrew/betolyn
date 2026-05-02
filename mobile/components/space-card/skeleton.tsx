import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Skeleton } from '@/components/skeleton';
import { colors } from '@/constants/colors';
import { pickRandom } from '@/utils/pick-random';

const SIZES = [90, 110, 130, 150, 170, 190, 200];

const titleSize = () => {
  return pickRandom(SIZES);
};

export default function SpaceCardSkeleton() {
  return (
    <View style={styles.container}>
      <Skeleton type="circle" size={40} />

      <View style={styles.body}>
        <Skeleton type="default" size={titleSize()} style={styles.title} />
        <Skeleton type="default" size={50} style={styles.description} />
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
    flexGrow: 0,
    height: 16,
  },
  description: {
    flexGrow: 0,
    height: 16,
  },
});
