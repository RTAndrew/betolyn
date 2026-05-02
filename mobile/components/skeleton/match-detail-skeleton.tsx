import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/colors';
import { hexToHexWithAlpha } from '@/utils/hex-rgba';

import { Spinner } from '../spinner';
import { Skeleton } from './index';

export function MatchDetailSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.highlight}>
        <View style={styles.teamsRow}>
          <View style={styles.teamBlock}>
            <Skeleton type="circle" size={80} />
          </View>

          <Skeleton type="default" borderRadius={4} size={48} style={{ flexGrow: 0 }} />

          <View style={styles.teamBlock}>
            <Skeleton type="circle" size={80} />
          </View>
        </View>
      </View>

      <View style={[styles.section, styles.sectionBorder]}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Skeleton
            style={{ flexGrow: 1, minWidth: 0, height: 30 }}
            color={hexToHexWithAlpha(colors.greyLighter, 0.2)}
            type="circle"
            borderRadius={8}
          />
          <Skeleton
            style={{ flexGrow: 1, minWidth: 0, height: 30 }}
            color={hexToHexWithAlpha(colors.greyLighter, 0.2)}
            type="circle"
            borderRadius={8}
          />
          <Skeleton
            style={{ flexGrow: 1, minWidth: 0, height: 30 }}
            color={hexToHexWithAlpha(colors.greyLighter, 0.2)}
            type="circle"
            borderRadius={8}
          />
        </View>
      </View>

      <MatchCriteriaSectionSkeleton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.greyLight,
  },
  header: {
    backgroundColor: colors.greyLight,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  headerBlock: {
    width: 120,
    height: 24,
  },
  highlight: {
    backgroundColor: colors.greyMedium,
    alignItems: 'center',
    paddingVertical: 30,
  },
  categoryLine: {
    width: 60,
    height: 14,
    marginBottom: 10,
  },
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 24,
  },
  teamBlock: {
    flex: 1,
    alignItems: 'center',
    gap: 10,
  },
  teamName: {
    width: 70,
    height: 14,
  },
  scoreLine: {
    width: 48,
    height: 20,
    alignSelf: 'center',
  },
  section: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  sectionBorder: {
    borderTopWidth: 0.25,
    borderColor: colors.greyLighter,
  },
  oddsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  oddButton: {
    flex: 1,
    height: 30,
    borderWidth: 100,
  },
  criteriaTitle: {
    width: 180,
    height: 14,
    marginBottom: 5,
  },
  criteriaSubtitle: {
    width: 220,
    height: 16,
  },
  collapsibleRow: {
    marginBottom: 16,
  },
  collapsibleTitle: {
    width: '40%',
    height: 14,
    marginBottom: 12,
  },
  smallOddButton: {
    width: 72,
    height: 36,
  },
  smallOddButtonEqual: {
    flex: 1,
    minWidth: 0,
    height: 30,
    borderRadius: 100,
  },
});

export function MatchCriteriaSectionSkeleton() {
  return (
    <View style={[styles.section, styles.sectionBorder]}>
      <Spinner style={{ marginTop: 60 }} size="large" color={colors.white} />
    </View>
  );
}
