import { DonutChart } from '@/components/donut-chart';
import Switch from '@/components/forms/switch';
import { MoreVertical } from '@/components/icons';
import { MatchEventSmallCard } from '@/components/match-event-small-card';
import { MatchBottomSheetProvider, useMatchBottomSheet } from '@/components/match/bottom-sheet';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import ScreenHeader from '@/components/screen-header';
import ScreenWrapper from '@/components/screen-wrapper';
import { Settings } from '@/components/settings';
import { Stats } from '@/components/stats';
import Tag from '@/components/tags';
import { ThemedText } from '@/components/ThemedText';
import { useGetMatch } from '@/services';
import { colors } from '@/constants/colors';
import { hexToRgba } from '@/utils/hex-rgba';
import { router, useLocalSearchParams } from 'expo-router';

import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MatchSettingsCriteriaList from '@/screens/matches/settings/criteria';

const OpenMatchBottomSheetIcon = () => {
  const { pushSheet } = useMatchBottomSheet();
  return (
    <ScreenHeader.QuickActions>
      <ScreenHeader.Icon
        onPress={() => pushSheet({ type: 'match-action' })}
        style={{ backgroundColor: colors.greyLight }}
      >
        <MoreVertical />
      </ScreenHeader.Icon>
    </ScreenHeader.QuickActions>
  );
};

const MatchSettings = () => {
  const { matchId } = useLocalSearchParams();
  const { data: result, isLoading, isError } = useGetMatch({ matchId: matchId as string });
  const [autoEnd, setAutoEnd] = useState(false);

  if (isLoading) return <ThemedText>Loading...</ThemedText>;
  if (isError) return <ThemedText>Error loading match</ThemedText>;
  if (!result?.data) return <ThemedText>Match not found</ThemedText>;

  const match = result.data;
  return (
    <MatchBottomSheetProvider match={match}>
      <ScreenWrapper safeArea={false} backgroundColor={colors.greyMedium}>
        <ScreenHeader
          iconContainerColor={colors.greyLight}
          iconColor={colors.white}
          onClose={() => router.back()}
          title={
            <View style={styles.matchEventSmallCard}>
              <MatchEventSmallCard
                showName={false}
                style={{ backgroundColor: 'transparent' }}
                match={match}
              />
            </View>
          }
        >
          <OpenMatchBottomSheetIcon />
        </ScreenHeader>

        <SafeHorizontalView style={styles.root}>
          <View style={styles.health}>
            <DonutChart
              size={220}
              strokeWidth={15}
              segments={[
                { value: 57, color: colors.complementary },
                { value: 100, color: hexToRgba(colors.complementary, 0.5) },
              ]}
              label={
                <View style={styles.chartLabel}>
                  <ThemedText type="default" style={styles.chartLabelPercent}>
                    57%
                  </ThemedText>
                  <ThemedText type="subtitle" style={styles.chartLabelSecondary}>
                    $1,590 / $3,000
                  </ThemedText>
                </View>
              }
            />

            <Stats.Group
              style={styles.stats}
              items={[
                {
                  title: 'P/L',
                  description: '$25.11',
                },
                {
                  title: 'Bets',
                  description: '19',
                },
                {
                  title: 'Vol.',
                  description: '$589',
                },
              ]}
            />
          </View>

          <Settings.ItemGroup>
            <Settings.Item
              title="24 October - 19:45"
              subtitle="Kick off"
              suffixIcon={<Tag.Live />}
            />
            <Settings.Item
              title="Cartões Amarelos"
              subtitle="Main Market"
              description={<Tag.Active title="Active" />}
              onPress={() => router.push(`/criteria/${match.mainCriterion?.id}/settings`)}
            />
          </Settings.ItemGroup>

          <Settings.Item
            onPress={() => setAutoEnd((prev) => !prev)}
            title="Auto-end"
            subtitle="Match will end automatically after the specified time."
            suffixIcon={<Switch value={autoEnd} onChange={setAutoEnd} />}
          />

          <Settings.ItemGroup title="Markets">
            <MatchSettingsCriteriaList matchId={match.id} />
          </Settings.ItemGroup>
        </SafeHorizontalView>
      </ScreenWrapper>
    </MatchBottomSheetProvider>
  );
};

export default MatchSettings;

const styles = StyleSheet.create({
  root: {
    gap: 18,
  },
  matchEventSmallCard: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  health: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
    marginVertical: 24,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  chartLabel: {
    alignItems: 'center',
    gap: 4,
  },
  chartLabelPercent: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.complementary,
  },
  chartLabelSecondary: {
    color: colors.greyLighter50,
  },
  badgeActive: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  marketSuffix: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  marketSuffixValue: {
    fontSize: 14,
    color: colors.greyLighter,
  },
  chevronRight: {
    transform: [{ rotate: '-90deg' }],
  },
});
