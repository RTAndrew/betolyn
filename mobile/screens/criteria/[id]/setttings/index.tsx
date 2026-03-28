import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import Switch from '@/components/forms/switch';
import { MoreVertical, Trophy } from '@/components/icons';
import { useMatchBottomSheet } from '@/components/match/bottom-sheet/context';
import { MatchBottomSheetProvider } from '@/components/match/bottom-sheet/provider';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import ScreenHeader from '@/components/screen-header';
import ScreenWrapper from '@/components/screen-wrapper';
import { Settings } from '@/components/settings';
import { Skeleton } from '@/components/skeleton';
import { SettingsScreenSkeleton } from '@/components/skeleton/settings-screen-skeleton';
import { ThemedText } from '@/components/ThemedText';
import { colors } from '@/constants/colors';
import { useGetCriterionById } from '@/services';
import { ICriterion } from '@/types';
import { getCriterionStatusTag, getMatchStatusTag } from '@/utils/get-entity-status-tag';

import CriteriaMetrics from './criteria-metrics';
import CriterionToggleMultipleWinners from './criterion-toggle-multiple-winners';

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

const CriterionSettingsScreen = ({ criterionId }: { criterionId: string }) => {
  const { data, isPending, error } = useGetCriterionById({ criterionId });

  if (isPending) {
    return (
      <ScreenWrapper safeArea={false} backgroundColor={colors.greyMedium}>
        <ScreenHeader
          iconColor={colors.white}
          onClose={() => router.back()}
          iconContainerColor={colors.greyLight}
          title={<Skeleton type="default" borderRadius={4} style={{ width: 140, height: 20 }} />}
        />
        <SafeHorizontalView style={styles.root}>
          <SettingsScreenSkeleton />
        </SafeHorizontalView>
      </ScreenWrapper>
    );
  }

  if (error || !data) return <ThemedText>Error loading criterion</ThemedText>;

  const criterion = data.data;
  if (!criterion) return <ThemedText>Criterion not found</ThemedText>;

  // TODO: create an util to get the match title
  const m = criterion.match;
  const matchTitle =
    m.homeTeam?.name && m.awayTeam?.name
      ? `${m.homeTeam.name} vs ${m.awayTeam.name}`
      : m.homeTeamName && m.awayTeamName
        ? `${m.homeTeamName} vs ${m.awayTeamName}`
        : 'Match';

  return (
    <MatchBottomSheetProvider match={m}>
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
          <CriteriaMetrics criterionId={criterionId as string} criterionStatus={criterion.status} />

          <Settings.Item
            title={criterion.name}
            subtitle="Criterion"
            description={getCriterionStatusTag(criterion.status)}
            suffixIcon={null}
          />

          <Settings.Item
            title={matchTitle}
            subtitle="Match"
            description={getMatchStatusTag(m.status)}
            onPress={() => router.push(`/matches/${m.id}`)}
          />

          <Settings.ItemGroup>
            <Settings.Item
              title="Allow multiple outcomes"
              subtitle="Multiple bets on the same outcome are allowed."
              suffixIcon={<Switch value={criterion.allowMultipleOdds} onChange={() => {}} />}
            />

            <CriterionToggleMultipleWinners criterion={criterion} />

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
});

export default CriterionSettingsScreen;
