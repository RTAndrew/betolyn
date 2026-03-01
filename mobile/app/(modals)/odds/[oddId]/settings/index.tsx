import Switch from '@/components/forms/switch';
import { MoreVertical } from '@/components/icons';
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
import { useGetMatch, useGetOddMetrics } from '@/services';
import { CriterionStatusEnum, IOdd } from '@/types';
import { colors } from '@/constants/colors';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

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
    data: matchData,
    isPending: matchIsPending,
    error: matchError,
  } = useGetMatch({
    matchId: metricsData?.data?.odd?.matchId ?? '',
    queryOptions: {
      enabled: Boolean(metricsData?.data?.odd?.matchId),
    },
  });

  if (isPending || matchIsPending) return <ThemedText>Loading...</ThemedText>;
  if (error || !metricsData || matchError) return <ThemedText>Error loading odd</ThemedText>;
  const metrics = metricsData.data;
  const odd = metrics?.odd;
  const match = matchData?.data;
  if (!metrics || !odd || !match) return <ThemedText>Odd not found</ThemedText>;

  const isSettled = odd.criterion?.status === CriterionStatusEnum.SETTLED;
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
                  {formatCurrency(metrics.totalOddVolume)} /{' '}
                  {formatCurrency(metrics.totalCriterionVolume)}
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
                {
                  title: isSettled ? 'P/L' : 'Pot. Payout',
                  description: formatCurrency(metrics.profitAndLosses),
                },
                {
                  title: 'Avg. Stake',
                  description: formatCurrency(metrics.averageStake),
                },
                {
                  title: 'Bets',
                  description: String(metrics.totalBetsCount),
                },
                {
                  title: 'Vol.',
                  description: formatCurrency(metrics.totalOddVolume),
                },
              ]}
            />
          </View>

          <Settings.ItemGroup>
            <Settings.Item
              title={`${match.homeTeam.name} vs ${match.awayTeam.name}`}
              subtitle="Event"
              description={<Tag.Live />}
              onPress={() => router.push(`/matches/${match.id}`)}
            />

            <Settings.Item
              title={odd.criterion.name}
              subtitle="Market"
              description={<Tag.Active />}
              onPress={() => router.push(`/criteria/${odd.criterion.id}/settings`)}
            />
          </Settings.ItemGroup>

          <Settings.ItemGroup>
            <Settings.Item
              title="Allow multiple outcomes"
              subtitle="Multiple bets on the same outcome are allowed."
              suffixIcon={<Switch value={odd.criterion.allowMultipleOdds} onChange={() => {}} />}
            />

            <Settings.Item
              title="Winning Outcome"
              suffixIcon={<Switch value={odd.isWinner ?? false} onChange={() => {}} />}
            />

            <Settings.Item
              title="Publish on kickoff"
              subtitle="When the match starts, the criterion will be published automatically."
              suffixIcon={<Switch value={false} onChange={() => {}} />}
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
