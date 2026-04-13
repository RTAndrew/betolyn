import { router } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';

import SafeHorizontalView from '@/components/safe-horizontal-view';
import Tag from '@/components/tags';
import { ThemedText } from '@/components/ThemedText';
import { colors } from '@/constants/colors';
import { useGetCriterionById, useGetMatch, useGetOddById } from '@/services';
import { IBetSlipItem, IBetSlipItemStatus } from '@/types';
import { formatKwanzaAmount, formatOddValue } from '@/utils/number-formatters';
import { useMultiQueryState } from '@/utils/react-query/use-multi-query-state';

import { SingleBetCardHistorySkeleton } from './skeleton';
import { styles } from './styles';

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const getStatusColor = (status: `${IBetSlipItemStatus}`) => {
  if (status === 'PENDING') return colors.complementary;
  if (status === 'WON') return '#00C853';
  if (status === 'LOST') return '#FF0000';
  return colors.greyLight;
};

const getStatusLabel = (status: `${IBetSlipItemStatus}`) => {
  if (status === 'PENDING') return 'Pending';
  if (status === 'WON') return 'Won';
  if (status === 'LOST') return 'Lost';
  return status;
};

export interface SingleBetCardHistoryProps {
  bet: IBetSlipItem;
}

const SingleBetCardHistory = ({ bet }: SingleBetCardHistoryProps) => {
  const matchQuery = useGetMatch({
    matchId: bet.matchId,
  });

  const oddQuery = useGetOddById({
    oddId: bet.oddId,
  });

  const criterionQuery = useGetCriterionById({ criterionId: bet.criterionId });

  const { isInitialLoading: isPending } = useMultiQueryState([
    { query: matchQuery },
    { query: oddQuery },
    { query: criterionQuery },
  ]);

  if (isPending) {
    return <SingleBetCardHistorySkeleton />;
  }

  const match = matchQuery.data?.data;
  const odd = oddQuery.data?.data;
  const criterion = criterionQuery.data?.data;

  const matchName =
    match?.homeTeam?.name && match?.awayTeam?.name
      ? `${match.homeTeam.name} vs ${match.awayTeam.name}`
      : (odd?.name ?? '-');

  const marketDescription = `${odd?.name} - ${criterion?.name}`;

  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: '/betslips/[id]', params: { id: bet.id, type: 'single' } })
      }
    >
      <SafeHorizontalView style={styles.card}>
        <View style={styles.headerRow}>
          <Tag title={getStatusLabel(bet.status)} color={getStatusColor(bet.status)} />
          <ThemedText style={styles.potentialPayout}>
            {formatKwanzaAmount(bet.potentialPayout)}
          </ThemedText>
        </View>

        <View style={styles.dividerLine} />

        <View style={styles.contentRow}>
          <View style={styles.body}>
            <ThemedText numberOfLines={1}>{matchName}</ThemedText>
            <ThemedText style={styles.secondaryText}>{formatCurrency(bet.stake)}</ThemedText>
          </View>

          <View style={styles.body}>
            <ThemedText numberOfLines={1} style={styles.secondaryText}>
              {marketDescription}
            </ThemedText>
            <ThemedText style={styles.secondaryText}>
              {formatOddValue(bet.oddValueAtPlacement)}
            </ThemedText>
          </View>
        </View>
      </SafeHorizontalView>
    </Pressable>
  );
};

export default SingleBetCardHistory;
