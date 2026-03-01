import Switch from '@/components/forms/switch';
import { MoreVertical, Trophy } from '@/components/icons';
import { useMatchBottomSheet } from '@/components/match/bottom-sheet/context';
import { MatchBottomSheetProvider } from '@/components/match/bottom-sheet/provider';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import ScreenHeader from '@/components/screen-header';
import ScreenWrapper from '@/components/screen-wrapper';
import { SegmentedProgressBar } from '@/components/segmented-progress-bar';
import { Settings } from '@/components/settings';
import { Stats } from '@/components/stats';
import Tag from '@/components/tags';
import { ThemedText } from '@/components/ThemedText';
import { useGetCriterionById, useGetCriterionMetrics } from '@/services';
import { ICriterion } from '@/types';

function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}
import { colors } from '@/constants/colors';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const OpenMatchBottomSheetIcon = ({ criterion }: { criterion: ICriterion }) => {
  const { pushSheet } = useMatchBottomSheet();
  return (
    <ScreenHeader.QuickActions>
      <ScreenHeader.Icon
        onPress={() => pushSheet({ type: 'criterion-action', data: criterion })}
        style={{ backgroundColor: colors.greyLight }}
      >
        <MoreVertical />
      </ScreenHeader.Icon>
    </ScreenHeader.QuickActions>
  );
};

const CriterionSettings = () => {
  const { criterionId } = useLocalSearchParams();
  const { data, isPending, error } = useGetCriterionById({ criterionId: criterionId as string });
  const { data: metricsData, isPending: metricsPending } = useGetCriterionMetrics({
    criterionId: criterionId as string,
  });

  if (isPending) return <ThemedText>Loading...</ThemedText>;
  if (error || !data) return <ThemedText>Error loading criterion</ThemedText>;
  const criterion = data.data;
  if (!criterion) return <ThemedText>Criterion not found</ThemedText>;

  const metrics = metricsData?.data;
  const reservedLiability = metrics?.reservedLiability ?? 0;
  const maxReservedLiability = metrics?.maxReservedLiability ?? 0;
  const riskLevel = metrics?.riskLevel ?? 0;
  const hasMax = maxReservedLiability > 0;
  const riskSegmentValue = hasMax
    ? Math.min(100, (reservedLiability / maxReservedLiability) * 100)
    : 0;
  const availableSegmentValue = hasMax ? Math.max(0, 100 - riskSegmentValue) : 100;

  return (
    <MatchBottomSheetProvider match={criterion.match}>
      <ScreenWrapper safeArea={false} backgroundColor={colors.greyMedium}>
        <ScreenHeader
          iconColor={colors.white}
          title={criterion.name}
          onClose={() => router.back()}
          iconContainerColor={colors.greyLight}
        >
          <OpenMatchBottomSheetIcon criterion={criterion} />
        </ScreenHeader>

        <SafeHorizontalView style={styles.root}>
          <View style={styles.health}>
            {metricsPending ? (
              <ThemedText type="default" style={{ color: '#A8A8A8' }}>
                Loading metrics...
              </ThemedText>
            ) : (
              <>
                <SegmentedProgressBar
                  segments={[
                    { value: riskSegmentValue, color: '#FF0080' },
                    { value: availableSegmentValue, color: '#00BF80' },
                  ]}
                  topLabel={
                    <ThemedText type="default" style={{ color: '#A8A8A8' }}>
                      {formatCurrency(reservedLiability)} / {formatCurrency(maxReservedLiability)}
                    </ThemedText>
                  }
                  bottomLabel={
                    <ThemedText type="defaultSemiBold" style={{ color: '#FF0080' }}>
                      {riskLevel.toFixed(0)}% Risk Level
                    </ThemedText>
                  }
                />

                <Stats.Group
                  style={styles.stats}
                  items={[
                    {
                      title: 'Potential P/L (Worst Case)',
                      description: formatCurrency(metrics?.profitAndLosses?.potentialPL ?? 0),
                    },
                    {
                      title: 'Realized P/L (After Settlement)',
                      description:
                        metrics?.profitAndLosses?.realizedPL != null
                          ? formatCurrency(metrics.profitAndLosses.realizedPL)
                          : 'N/A',
                    },
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
              </>
            )}
          </View>

          <Settings.Item
            title={`${criterion.match.homeTeam.name} vs ${criterion.match.awayTeam.name}`}
            subtitle="Match"
            description={<Tag.Live />}
            onPress={() => router.push(`/matches/${criterion.match.id}`)}
          />

          <Settings.ItemGroup>
            <Settings.Item
              title="Allow multiple outcomes"
              subtitle="Multiple bets on the same outcome are allowed."
              suffixIcon={<Switch value={criterion.allowMultipleOdds} onChange={() => {}} />}
            />

            <Settings.Item
              title="Allow multiple winners"
              subtitle="Multiple outcomes will be chosen as winners."
              suffixIcon={<Switch value={criterion.allowMultipleWinners} onChange={() => {}} />}
            />

            <Settings.Item
              title="Publish on kickoff"
              subtitle="When the match starts, the criterion will be published automatically."
              suffixIcon={<Switch value={false} onChange={() => {}} />}
            />
          </Settings.ItemGroup>

          <Settings.ItemGroup title="Outcomes">
            {criterion.odds.map((odd) => (
              <Settings.Item
                key={odd.id}
                onPress={() => router.push(`/odds/${odd.id}/settings`)}
                title={
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <ThemedText style={{ color: colors.complementary, fontWeight: 600 }}>
                      {odd.value}
                    </ThemedText>
                    <ThemedText type="default">{odd.name}</ThemedText>
                  </View>
                }
                description={odd.isWinner && <Trophy width={18} height={18} />}
              />
            ))}
          </Settings.ItemGroup>
        </SafeHorizontalView>
      </ScreenWrapper>
    </MatchBottomSheetProvider>
  );
};

const styles = StyleSheet.create({
  root: {
    gap: 18,
  },
  health: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginVertical: 24,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
});

export default CriterionSettings;
