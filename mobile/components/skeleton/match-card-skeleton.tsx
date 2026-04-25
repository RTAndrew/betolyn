import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/colors';
import { hexToHexWithAlpha } from '@/utils/hex-rgba';

import { Skeleton } from './index';

const TEAM_NAME_WIDTHS = [70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

const BACKGROUND_COLOR = hexToHexWithAlpha(colors.greyLighter, 0.2);

export function MatchCardSkeleton() {
  const [teamOneNameWidth, teamTwoNameWidth] = useMemo(
    () => [randomFrom(TEAM_NAME_WIDTHS), randomFrom(TEAM_NAME_WIDTHS)],
    []
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.teamBody}>
          <View style={styles.teamWrapper}>
            <View style={styles.teamRow}>
              <Skeleton color={BACKGROUND_COLOR} type="circle" size={50} />
              <Skeleton
                color={BACKGROUND_COLOR}
                type="default"
                borderRadius={4}
                style={StyleSheet.flatten([styles.teamNameLine, { width: teamOneNameWidth }])}
              />
            </View>
            <View style={styles.teamRow}>
              <Skeleton color={BACKGROUND_COLOR} type="circle" size={50} />
              <Skeleton
                color={BACKGROUND_COLOR}
                type="default"
                borderRadius={4}
                style={StyleSheet.flatten([styles.teamNameLine, { width: teamTwoNameWidth }])}
              />
            </View>
          </View>

          <View style={styles.betInfo}>
            <View style={styles.divider} />
          </View>
        </View>

        <View style={styles.oddsWrapper}>
          <Skeleton
            color={BACKGROUND_COLOR}
            type="default"
            borderRadius={8}
            style={styles.oddButton}
          />
          <Skeleton
            color={BACKGROUND_COLOR}
            type="default"
            borderRadius={8}
            style={styles.oddButton}
          />
          <Skeleton
            color={BACKGROUND_COLOR}
            type="default"
            borderRadius={8}
            style={styles.oddButton}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    borderBottomWidth: 0.3,
    borderBottomColor: colors.greyLighter,
    flexDirection: 'column',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  teamWrapper: {
    flexDirection: 'column',
    flex: 1,
    gap: 15,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  teamNameLine: {
    backgroundColor: BACKGROUND_COLOR,
    flexGrow: 0,
  },
  scoreLine: {
    width: 24,
    height: 14,
  },
  betInfo: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    width: 0.3,
    marginHorizontal: 10,
    height: '90%',
    backgroundColor: colors.greyLight,
  },
  oddsWrapper: {
    marginLeft: 50,
    flexDirection: 'column',
    gap: 10,
  },
  oddButton: {
    width: 70,
    height: 25,
    borderRadius: 1000,
  },
});
