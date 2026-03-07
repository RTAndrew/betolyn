import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { MoreVertical, Trophy } from '@/components/icons';
import { useMatchBottomSheet } from '@/components/match/bottom-sheet/context';
import { MatchBottomSheetProvider } from '@/components/match/bottom-sheet/provider';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import ScreenHeader from '@/components/screen-header';
import ScreenWrapper from '@/components/screen-wrapper';
import { SegmentedProgressBar } from '@/components/segmented-progress-bar';
import { Settings } from '@/components/settings';
import { SettingsScreenSkeleton } from '@/components/skeleton/settings-screen-skeleton';
import { Stats } from '@/components/stats';
import { ThemedText } from '@/components/ThemedText';
import { colors } from '@/constants/colors';
import { useGetMatch, useGetOddById, useGetOddMetrics } from '@/services';
import { IOdd } from '@/types';
import { formatKNumber } from '@/utils/format-k-number';
import { getMatchStatusTag, getOddStatusTag } from '@/utils/get-entity-status-tag';

const OpenMatchBottomSheetIcon = ({ odd }: { odd: IOdd }) => {
  const { pushSheet } = useMatchBottomSheet();
  return (
    <ScreenHeader.QuickActions>
      <ScreenHeader.Icon
        onPress={() => pushSheet({ type: 'odd-action', data: odd })}
        style={{ backgroundColor: colors.greyLight }}
      >
        <MoreVertical />
      </ScreenHeader.Icon>
    </ScreenHeader.QuickActions>
  );
};

const OddSettings = () => {
  const { oddId } = useLocalSearchParams();
  const { data: metricsData, isPending, error } = useGetOddMetrics({ oddId: oddId as string });
  const {
    data: oddData,
    isPending: oddIsPending,
    error: oddError,
  } = useGetOddById({ oddId: oddId as string });
  const odd = oddData?.data;
  const {
    data: matchData,
    isPending: matchIsPending,
    error: matchError,
  } = useGetMatch({
    matchId: metricsData?.data?.odd?.matchId ?? '',
    queryOptions: {
      enabled: Boolean(metricsData?.data?.odd?.matchId),
    },
  });

  if (isPending || matchIsPending || oddIsPending) {
    return (
      <ScreenWrapper safeArea={false} backgroundColor={colors.greyMedium}>
        <ScreenHeader
          iconColor={colors.white}
          onClose={() => router.back()}
          iconContainerColor={colors.greyLight}
        />
        <SafeHorizontalView style={styles.root}>
          <SettingsScreenSkeleton variant="criterion" />
        </SafeHorizontalView>
      </ScreenWrapper>
    );
  }

  if (error || !metricsData || matchError) return <ThemedText>Error loading odd</ThemedText>;
  const metrics = metricsData.data;
  const match = matchData?.data;
  if (!metrics || !odd || !match) return <ThemedText>Odd not found</ThemedText>;

  const marketSharePct = Math.round(metrics.marketShare);

  return (
    <MatchBottomSheetProvider match={match}>
      <ScreenWrapper safeArea={false} backgroundColor={colors.greyMedium}>
        <ScreenHeader
          iconColor={colors.white}
          title={odd.name}
          onClose={() => router.back()}
          iconContainerColor={colors.greyLight}
        >
          <OpenMatchBottomSheetIcon odd={odd} />
        </ScreenHeader>

        <SafeHorizontalView style={styles.root}>
          <View style={styles.health}>
            <SegmentedProgressBar
              segments={[
                { value: marketSharePct, color: colors.greyLighter },
                { value: 100 - marketSharePct, color: colors.greyLighter50 },
              ]}
              topLabel={
                <ThemedText type="default" style={{ color: '#A8A8A8' }}>
                  {formatKNumber(metrics.totalOddVolume, true)} /{' '}
                  {formatKNumber(metrics.totalCriterionVolume, true)}
                </ThemedText>
              }
              bottomLabel={
                <ThemedText type="defaultSemiBold" style={{ color: colors.white }}>
                  {marketSharePct}% Market Share
                </ThemedText>
              }
            />

            <Stats.Group
              style={styles.stats}
              items={[
                ...(metrics.profitAndLosses != null
                  ? [{ title: 'P/L', description: formatKNumber(metrics.profitAndLosses, true) }]
                  : []),
                {
                  title: 'Avg. Stake',
                  description: formatKNumber(metrics.averageStake, true),
                },
                {
                  title: 'Bets',
                  description: String(metrics.totalBetsCount),
                },
                {
                  title: 'Vol.',
                  description: formatKNumber(metrics.totalOddVolume, true),
                },
              ]}
            />
          </View>

          <Settings.ItemGroup>
            <Settings.Item
              title={
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 0 }}>
                  <ThemedText type="defaultSemiBold" style={{ color: colors.complementary }}>
                    {' '}
                    {odd.value}{' '}
                  </ThemedText>
                  <ThemedText>{'-'}</ThemedText>
                  <ThemedText type="defaultSemiBold"> {odd.name} </ThemedText>
                </View>
              }
              subtitle="Outcome"
              description={getOddStatusTag(odd.status)}
              suffixIcon={odd.isWinner && <Trophy />}
            />

            <Settings.Item
              title={`${match.homeTeam.name} vs ${match.awayTeam.name}`}
              subtitle="Event"
              description={getMatchStatusTag(match.status)}
              onPress={() => router.push(`/matches/${match.id}`)}
            />

            <Settings.Item
              title={odd.criterion.name}
              subtitle="Market"
              description={getOddStatusTag(odd.criterion.status)}
              onPress={() => router.push(`/criteria/${odd.criterion.id}/settings`)}
            />
          </Settings.ItemGroup>

          <Settings.ItemGroup>
            <Settings.Item
              title="Winning Outcome"
              description={odd.isWinner ? 'Yes' : 'No'}
              suffixIcon={null}
            />
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
    marginTop: 18,
  },
});

export default OddSettings;
