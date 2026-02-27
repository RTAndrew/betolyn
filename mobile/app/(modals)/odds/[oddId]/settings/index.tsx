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
import { useGetMatch, useGetOddById } from '@/services';
import { IMatch } from '@/types';
import { colors } from '@/constants/colors';
import { hexToRgba } from '@/utils/hex-rgba';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const OpenMatchBottomSheetIcon = ({ match }: { match: IMatch }) => {
  const { pushSheet } = useMatchBottomSheet();
  return (
    <ScreenHeader.QuickActions>
      <ScreenHeader.Icon
        onPress={() => pushSheet({ type: 'odd-action', data: match })}
        style={{ backgroundColor: colors.greyLight }}
      >
        <MoreVertical />
      </ScreenHeader.Icon>
    </ScreenHeader.QuickActions>
  );
};

const OddSettings = () => {
  const { oddId } = useLocalSearchParams();
  const { data, isPending, error } = useGetOddById({ oddId: oddId as string });
  const {
    data: matchData,
    isPending: matchIsPending,
    error: matchError,
  } = useGetMatch({
    matchId: data?.data.matchId ?? '',
    queryOptions: {
      enabled: Boolean(data?.data.matchId),
    },
  });

  if (isPending || matchIsPending) return <ThemedText>Loading...</ThemedText>;
  if (error || !data || matchError) return <ThemedText>Error loading criterion</ThemedText>;
  const odd = data.data;
  const match = matchData.data;
  if (!odd || !match) return <ThemedText>Criterion not found</ThemedText>;

  return (
    <MatchBottomSheetProvider match={match}>
      <ScreenWrapper safeArea={false} backgroundColor={colors.greyMedium}>
        <ScreenHeader
          iconColor={colors.white}
          title={odd.name}
          onClose={() => router.back()}
          iconContainerColor={colors.greyLight}
        >
          <OpenMatchBottomSheetIcon match={match} />
        </ScreenHeader>

        <SafeHorizontalView style={styles.root}>
          <View style={styles.health}>
            <SegmentedProgressBar
              segments={[
                { value: 75, color: '#FF0080' },
                { value: 25, color: '#00BF80' },
              ]}
              topLabel={
                <ThemedText type="default" style={{ color: '#A8A8A8' }}>
                  $790 / $2,000
                </ThemedText>
              }
              bottomLabel={
                <ThemedText type="defaultSemiBold" style={{ color: '#FF0080' }}>
                  75% Risk Level
                </ThemedText>
              }
            />

            <Stats.Group
              style={styles.stats}
              items={[
                {
                  title: 'Pot. Payout',
                  description: '$25.11',
                },
                {
                  title: 'Avg. Stake',
                  description: '19',
                },
                {
                  title: 'Bets',
                  description: '89',
                },
                {
                  title: 'Vol.',
                  description: '$589',
                },
              ]}
            />

            <SegmentedProgressBar
              segments={[
                { value: 25, color: colors.greyLighter },
                { value: 75, color: colors.greyLighter50 },
              ]}
              topLabel={
                <ThemedText type="default" style={{ color: '#A8A8A8' }}>
                  $250 / $1,000
                </ThemedText>
              }
              bottomLabel={
                <ThemedText type="defaultSemiBold" style={{ color: colors.white }}>
                  25% Market Share
                </ThemedText>
              }
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
    marginBottom: 22,
  },
});

export default OddSettings;
