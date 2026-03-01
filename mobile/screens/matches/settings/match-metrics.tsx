import { DonutChart } from '@/components/donut-chart';
import { Stats } from '@/components/stats';
import { ThemedText } from '@/components/ThemedText';
import { useGetMatchMetrics } from '@/services';
import { colors } from '@/constants/colors';
import { formatKNumber } from '@/utils/format-k-number';
import { getRiskLevelColor } from '@/utils/risk-level-color';
import { hexToRgba } from '@/utils/hex-rgba';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export interface MatchMetricsProps {
  matchId: string;
  style?: object;
}

const MatchMetrics = ({ matchId, style }: MatchMetricsProps) => {
  const { data, isPending, error } = useGetMatchMetrics({
    matchId,
    queryOptions: { enabled: Boolean(matchId) },
  });

  if (isPending) {
    return (
      <View style={[styles.loading, style]}>
        <ActivityIndicator size="small" color={colors.greyLighter} />
        <ThemedText type="subtitle" style={styles.loadingText}>
          Loading metrics…
        </ThemedText>
      </View>
    );
  }

  if (error || !data) return null;

  const {
    profitAndLosses,
    totalVolume,
    reservedLiability,
    maxReservedLiability,
    riskLevel,
    totalCriteriaCount,
    totalBetCount,
  } = data.data;

  const riskPercent = Math.min(100, Math.max(0, riskLevel ?? 0));
  const riskColor = getRiskLevelColor(riskPercent);

  return (
    <View style={styles.container}>
      <DonutChart
        size={220}
        strokeWidth={15}
        segments={[
          { value: riskPercent, color: riskColor },
          { value: 100 - riskPercent, color: hexToRgba(riskColor, 0.5) },
        ]}
        label={
          <View style={styles.chartLabel}>
            <ThemedText type="default" style={[styles.chartLabelPercent, { color: riskColor }]}>
              {riskPercent.toFixed(0)}%
            </ThemedText>
            <ThemedText type="subtitle" style={styles.chartLabelSecondary}>
              {formatKNumber(reservedLiability, true)} exp. /{' '}
              {formatKNumber(maxReservedLiability ?? 0, true)} max. exp.
            </ThemedText>
          </View>
        }
      />
      <Stats.Group
        style={StyleSheet.flatten([styles.stats, style])}
        items={[
          ...(profitAndLosses != null
            ? [
                {
                  title: 'P/L',
                  description: formatKNumber(profitAndLosses, true),
                },
              ]
            : []),
          {
            title: 'Criteria',
            description: String(totalCriteriaCount ?? 0),
          },
          {
            title: 'Bets',
            description: formatKNumber(totalBetCount ?? 0),
          },
          {
            title: 'Vol.',
            description: formatKNumber(totalVolume, true),
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  loadingText: {
    color: colors.greyLighter,
  },
  chartLabel: {
    alignItems: 'center',
    gap: 4,
  },
  chartLabelPercent: {
    fontSize: 32,
    fontWeight: '700',
  },
  chartLabelSecondary: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.greyLighter50,
  },
});

export default MatchMetrics;
