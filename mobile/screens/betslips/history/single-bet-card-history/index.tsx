import React from 'react';
import { Image, View } from 'react-native';

import SafeHorizontalView from '@/components/safe-horizontal-view';
import { ThemedText } from '@/components/ThemedText';
import { colors } from '@/constants/colors';
import { useGetCriterionById, useGetMatch, useGetOddById } from '@/services';
import { IBetSlipItem, IBetSlipItemStatus } from '@/types';

import { SingleBetCardHistorySkeleton } from './skeleton';
import { styles } from './styles';

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
  if (status === 'PENDING') return colors.complementary2;
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
    return <SingleBetCardHistorySkeleton />;
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
