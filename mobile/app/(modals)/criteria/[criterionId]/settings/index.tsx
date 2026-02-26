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
import { useGetCriterionById } from '@/services';
import { ICriterion } from '@/types';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const OpenMatchBottomSheetIcon = ({ criterion }: { criterion: ICriterion }) => {
  const { pushSheet } = useMatchBottomSheet();
  return (
    <ScreenHeader.QuickActions>
      <ScreenHeader.Icon
        onPress={() => pushSheet({ type: 'criterion-action', data: criterion })}
        style={{ backgroundColor: '#61687E' }}
      >
        <MoreVertical width={24} height={24} />
      </ScreenHeader.Icon>
    </ScreenHeader.QuickActions>
  );
};

const CriterionSettings = () => {
  const { criterionId } = useLocalSearchParams();
  const { data, isPending, error } = useGetCriterionById({ criterionId: criterionId as string });

  if (isPending) return <ThemedText>Loading...</ThemedText>;
  if (error || !data) return <ThemedText>Error loading criterion</ThemedText>;
  const criterion = data.data;
  if (!criterion) return <ThemedText>Criterion not found</ThemedText>;

  return (
    <MatchBottomSheetProvider match={criterion.match}>
      <ScreenWrapper safeArea={false} backgroundColor="#485164">
        <ScreenHeader
          iconColor="white"
          title={criterion.name}
          onClose={() => router.back()}
          iconContainerColor="#61687E"
        >
          <OpenMatchBottomSheetIcon criterion={criterion} />
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
                  title: 'P/L',
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
                title={
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <ThemedText style={{ color: '#F3CA41', fontWeight: 600 }}>
                      {odd.value}
                    </ThemedText>
                    <ThemedText type="default">{odd.name}</ThemedText>
                  </View>
                }
                description="30"
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
