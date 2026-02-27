import SafeHorizontalView from '@/components/safe-horizontal-view';
import { ThemedText } from '@/components/ThemedText';
import { useGetCriterionById, useGetMatch, useGetOddById } from '@/services';
import { IBetSlipItem, IBetSlipItemStatus } from '@/types';
import { colors } from '@/constants/colors';
import React from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';

function formatOdd(value: number): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const getStatusColor = (status: `${IBetSlipItemStatus}`) => {
  if (status === 'PENDING') return '#E8C547';
  if (status === 'WON') return '#00C853';
  if (status === 'LOST') return '#FF0000';
  return colors.greyLight;
};

export interface SingleBetCardHistoryProps {
  bet: IBetSlipItem;
}

const SingleBetCardHistory = ({ bet }: SingleBetCardHistoryProps) => {
  const {
    data: matchData,
    isPending: matchPending,
    isError: matchError,
  } = useGetMatch({
    matchId: bet.matchId,
  });

  const {
    data: oddData,
    isPending: oddPending,
    isError: oddError,
  } = useGetOddById({
    oddId: bet.oddId,
  });

  const {
    data: criterionData,
    isPending: criterionPending,
    isError: criterionError,
  } = useGetCriterionById({ criterionId: bet.criterionId });

  const isPending = matchPending || oddPending || criterionPending;

  if (isPending) {
    return (
      <View style={styles.card}>
        <View style={styles.logos}>
          <ActivityIndicator size="small" color={colors.greyLighter} />
        </View>
        <View style={styles.body}>
          <View style={styles.skeletonLine} />
          <View style={[styles.skeletonLine, { width: '60%', marginTop: 6 }]} />
        </View>
        <View style={styles.footer}>
          <View style={[styles.skeletonLine, { width: 48 }]} />
          <View style={[styles.skeletonLine, { width: 64, marginTop: 6 }]} />
        </View>
      </View>
    );
  }

  if (matchError || oddError || criterionError) {
    return (
      <View style={styles.card}>
        <ThemedText>Error loading bet</ThemedText>
      </View>
    );
  }

  const match = matchData?.data;
  const odd = oddData?.data;
  const criterion = criterionData?.data;

  const homeBadge = match?.homeTeam?.badgeUrl;
  const awayBadge = match?.awayTeam?.badgeUrl;

  return (
    <SafeHorizontalView style={styles.card}>
      {homeBadge && awayBadge && (
        <View style={styles.logos}>
          {homeBadge && <Image source={{ uri: homeBadge }} style={styles.logo} />}
          {awayBadge && (
            <Image
              source={{ uri: awayBadge }}
              style={[styles.logo, homeBadge && styles.logoOverlap]}
            />
          )}
        </View>
      )}

      <View style={styles.body}>
        <ThemedText style={styles.oddName} numberOfLines={1}>
          {odd?.name}
        </ThemedText>
        <ThemedText style={styles.secondaryText} numberOfLines={1}>
          {criterion?.name}
        </ThemedText>
      </View>

      <View style={styles.footer}>
        <ThemedText style={styles.stake}>{formatCurrency(bet.stake)}</ThemedText>
        <View style={styles.oddsRow}>
          <ThemedText style={styles.secondaryText}>{formatOdd(bet.oddValueAtPlacement)}</ThemedText>
          <ThemedText style={styles.secondaryText}> • </ThemedText>
          <ThemedText style={[styles.potentialPayout, { color: getStatusColor(bet.status) }]}>
            {formatCurrency(bet.potentialPayout)}
          </ThemedText>
        </View>
      </View>
    </SafeHorizontalView>
  );
};

export default SingleBetCardHistory;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.greyMedium,
    borderRadius: 8,
    paddingVertical: 12,
    gap: 12,
  },
  logos: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    padding: 2,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.greyMedium,
    backgroundColor: colors.greyMedium,
  },
  logoOverlap: {
    marginTop: -6,
  },
  logoPlaceholder: {
    backgroundColor: colors.greyLight,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
    gap: 4,
  },
  oddName: {
    fontWeight: '400',
    color: colors.white,
  },
  secondaryText: {
    color: colors.greyLighter,
    marginTop: 2,
  },
  footer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 4,
  },
  stake: {
    fontSize: 16,
    color: colors.white,
    fontWeight: '700',
  },
  oddsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
  },
  potentialPayout: {
    color: '#E8C547',
    fontWeight: '600',
  },
  skeletonLine: {
    backgroundColor: colors.greyLight,
    borderRadius: 4,
  },
});
