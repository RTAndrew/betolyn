import React from 'react';
import { StyleSheet, View } from 'react-native';

import { SegmentedProgressBar } from '@/components/segmented-progress-bar';
import { Stats } from '@/components/stats';
import { ThemedText } from '@/components/ThemedText';
import { useGetCriterionMetrics } from '@/services';
import { CriterionStatusEnum } from '@/types';
import { hexToRgba } from '@/utils/hex-rgba';
import { getRiskLevelColor } from '@/utils/risk-level-color';

function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

export interface CriteriaMetricsProps {
  criterionId: string;
  criterionStatus: string;
}

const CriteriaMetrics = ({ criterionId, criterionStatus }: CriteriaMetricsProps) => {
  const { data: metricsData, isPending: metricsPending } = useGetCriterionMetrics({
    criterionId,
  });

  const metrics = metricsData?.data;
  const reservedLiability = metrics?.reservedLiability ?? 0;
  const maxReservedLiability = metrics?.maxReservedLiability ?? 0;
  const riskLevel = metrics?.riskLevel ?? 0;
  const hasMax = maxReservedLiability > 0;
  const riskSegmentValue = hasMax
    ? Math.min(100, (reservedLiability / maxReservedLiability) * 100)
    : 0;
  const availableSegmentValue = hasMax ? Math.max(0, 100 - riskSegmentValue) : 100;

  if (metricsPending) {
    return (
      <View style={styles.health}>
        <ThemedText type="default" style={{ color: '#A8A8A8' }}>
          Loading metrics...
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.health}>
      <SegmentedProgressBar
        segments={[
          { value: riskSegmentValue, color: getRiskLevelColor(riskLevel) },
          { value: availableSegmentValue, color: hexToRgba(getRiskLevelColor(riskLevel), 0.5) },
        ]}
        topLabel={
          <ThemedText type="default" style={{ color: '#A8A8A8' }}>
            {formatCurrency(reservedLiability)} exp. {' / '} {formatCurrency(maxReservedLiability)}{' '}
            max. exp.
          </ThemedText>
        }
        bottomLabel={
          <ThemedText
            style={StyleSheet.flatten([styles.riskLevel, { color: getRiskLevelColor(riskLevel) }])}
          >
            {riskLevel.toFixed(0)}% Risk Level
          </ThemedText>
        }
      />

      <Stats.Group
        style={styles.stats}
        items={[
          ...(criterionStatus === CriterionStatusEnum.SETTLED
            ? [
                {
                  title: 'P/L',
                  description:
                    metrics?.profitAndLosses != null
                      ? formatCurrency(metrics.profitAndLosses)
                      : 'N/A',
                },
              ]
            : [
                {
                  title: 'Exposure',
                  description: formatCurrency(reservedLiability),
                },
              ]),
          {
            title: 'Bets',
            description: String(metrics?.totalBetsCount ?? 0),
          },
          {
            title: 'Vol.',
            description: formatCurrency(metrics?.totalStakesVolume ?? 0),
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  health: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginVertical: 22,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 18,
  },
  riskLevel: {
    fontWeight: '600',
  },
});

export default CriteriaMetrics;
