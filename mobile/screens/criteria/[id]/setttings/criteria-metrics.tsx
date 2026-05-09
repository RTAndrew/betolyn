import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { SegmentedProgressBar } from '@/components/segmented-progress-bar';
import { MetricsBlockSkeleton } from '@/components/skeleton/metrics-block-skeleton';
import { Stats } from '@/components/stats';
import { ThemedText } from '@/components/ThemedText';
import { useGetCriterionMetrics } from '@/services';
import { CriterionStatusEnum } from '@/types';
import { formatKNumber } from '@/utils/format-k-number';
import { hexToRgba } from '@/utils/hex-rgba';
import { formatKwanzaAmount } from '@/utils/number-formatters';
import { getRiskLevelColor } from '@/utils/risk-level-color';

export interface CriteriaMetricsProps {
  criterionId: string;
  criterionStatus: string;
  shouldRefetch?: boolean;
}

const CriteriaMetrics = ({
  criterionId,
  criterionStatus,
  shouldRefetch = false,
}: CriteriaMetricsProps) => {
  const {
    data: metricsData,
    isPending: metricsPending,
    refetch,
  } = useGetCriterionMetrics({
    criterionId,
  });

  useEffect(
    function refetchCriterionMetricsWhenTriggered() {
      if (!shouldRefetch) return;
      refetch();
    },
    [shouldRefetch, refetch]
  );

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
        <MetricsBlockSkeleton variant="criterion" />
      </View>
    );
  }

  return (
    <View style={styles.health}>
      <SegmentedProgressBar
        segments={[
          { value: riskSegmentValue, color: getRiskLevelColor(riskLevel) },
          // @ts-ignore
          { value: availableSegmentValue, color: hexToRgba(getRiskLevelColor(riskLevel), 0.5) },
        ]}
        topLabel={
          <ThemedText type="default" style={{ color: '#A8A8A8' }}>
            {formatKwanzaAmount(reservedLiability)} risco. {' / '}{' '}
            {formatKwanzaAmount(maxReservedLiability)} lim. risco.
          </ThemedText>
        }
        bottomLabel={
          <ThemedText
            style={StyleSheet.flatten([styles.riskLevel, { color: getRiskLevelColor(riskLevel) }])}
          >
            {riskLevel.toFixed(0)}% Nível de Risco
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
                      ? formatKwanzaAmount(metrics.profitAndLosses)
                      : 'N/A',
                },
              ]
            : [
                {
                  title: 'Risco',
                  description: formatKNumber(reservedLiability, true),
                },
              ]),
          {
            title: 'Apostas',
            description: String(metrics?.totalBetsCount ?? 0),
          },
          {
            title: 'Volume',
            description: formatKNumber(metrics?.totalStakesVolume ?? 0, true),
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
