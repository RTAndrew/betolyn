import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { Image, Text, View, ViewProps } from 'react-native';
import { ScrollView, SheetManager } from 'react-native-actions-sheet';

import BottomSheet from '@/components/bottom-sheet';
import { MoreVertical, Settings, Sync } from '@/components/icons';
import { MatchBottomSheetProvider, useMatchBottomSheet } from '@/components/match/bottom-sheet';
import { OddButton } from '@/components/odd-button';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import ScreenHeader from '@/components/screen-header';
import { MatchDetailSkeleton } from '@/components/skeleton/match-detail-skeleton';
import { ThemedText } from '@/components/ThemedText';
import { colors } from '@/constants/colors';
import { useGetMatch } from '@/services/matches/match-query';
import { MatchStatusEnum } from '@/types';
import { getMatchStatusTag } from '@/utils/get-entity-status-tag';

import MatchCriteriaList from './match-criteria-list';

interface MatchTeamProps {
  name: string;
  imageUrl: string;
}

const MatchTeam = ({ name, imageUrl }: MatchTeamProps) => {
  return (
    <View
      style={{
        width: 'auto',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        flex: 1,
      }}
    >
      <View style={{ width: 80, height: 80, borderRadius: 0, overflow: 'hidden' }}>
        <Image
          source={{ uri: imageUrl }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      </View>

      <Text style={{ color: 'white', maxWidth: '70%', textAlign: 'center' }}>{name}</Text>
    </View>
  );
};

export const Section = ({ children, style }: ViewProps) => {
  return (
    <View
      style={[
        {
          paddingVertical: 20,
          borderColor: colors.greyLighter,
          borderTopWidth: 0.25,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const OpenMatchBottomSheet = () => {
  const { pushSheet } = useMatchBottomSheet();
  return (
    <ScreenHeader.Icon onPress={() => pushSheet({ type: 'match-action' })}>
      <MoreVertical />
    </ScreenHeader.Icon>
  );
};

const BottomSheetWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <BottomSheet
      onClose={() => SheetManager.hide('match')}
      CustomHeaderComponent={<></>}
      drawUnderStatusBar
      useBottomSafeAreaPadding={false}
      containerStyle={{ flex: 1, padding: 0, margin: 0, backgroundColor: colors.greyMedium }}
    >
      <ScrollView
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
        style={{ height: '100%', backgroundColor: colors.greyMedium }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {children}
      </ScrollView>
    </BottomSheet>
  );
};

const MatchScreen = ({ matchId }: { matchId: string }) => {
  const { data: result, refetch, isPending, isError } = useGetMatch({ matchId: matchId });

  const shouldShowMainCriterion = useMemo(() => {
    const match = result?.data;
    if (!match) return false;

    const shouldShowMainCriterion = ![MatchStatusEnum.CANCELLED, MatchStatusEnum.ENDED].includes(
      match?.status as MatchStatusEnum
    );

    const isMainCriterionActive =
      match.mainCriterion &&
      match.mainCriterion.status === 'ACTIVE' &&
      match.mainCriterion.odds.length &&
      match.mainCriterion.odds.length > 0;

    return shouldShowMainCriterion && isMainCriterionActive;
  }, [result?.data]);

  if (isPending) {
    return (
      <BottomSheetWrapper>
        <ScreenHeader
          type="down"
          safeArea={false}
          iconContainerColor={colors.greyMedium}
          onClose={() => SheetManager.hide('match')}
          style={{
            backgroundColor: colors.greyMedium,
          }}
        />
        <MatchDetailSkeleton />
      </BottomSheetWrapper>
    );
  }

  if (isError) return <Text>Error loading match</Text>;
  if (!result?.data) return <Text>Match not found</Text>;

  const match = result.data;

  return (
    <BottomSheetWrapper>
      <MatchBottomSheetProvider match={match}>
        <View style={{ backgroundColor: colors.greyLight, flex: 1, paddingBottom: 100 }}>
          <ScreenHeader
            type="down"
            safeArea={false}
            iconContainerColor={colors.greyMedium}
            onClose={() => SheetManager.hide('match')}
            style={{
              backgroundColor: colors.greyMedium,
            }}
          >
            <ScreenHeader.QuickActions style={{ backgroundColor: colors.greyMedium }}>
              <ScreenHeader.Icon onPress={() => refetch()}>
                <Sync />
              </ScreenHeader.Icon>

              <ScreenHeader.Icon
                onPress={() => {
                  SheetManager.hide('match');
                  router.push(`/matches/${matchId}/settings`);
                }}
              >
                <Settings />
              </ScreenHeader.Icon>

              <OpenMatchBottomSheet />
            </ScreenHeader.QuickActions>
          </ScreenHeader>

          <SafeHorizontalView style={{ backgroundColor: colors.greyMedium }}>
            {/* Highlight */}
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                paddingVertical: 30,
              }}
            >
              <View style={{ marginBottom: 10 }}>
                {getMatchStatusTag(match.status, Boolean(match.settledAt))}
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                }}
              >
                <MatchTeam name={match.homeTeam.name} imageUrl={match.homeTeam.badgeUrl} />
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: colors.white,
                    transform: [{ translateY: 35 }],
                  }}
                >
                  {match.homeTeamScore !== undefined || match.homeTeamScore !== null
                    ? `${match.homeTeamScore} - ${match.awayTeamScore}`
                    : 'vs'}
                </Text>
                <MatchTeam name={match.awayTeam.name} imageUrl={match.awayTeam.badgeUrl} />
              </View>
            </View>

            {/* Main Bet */}
            {shouldShowMainCriterion && (
              <Section
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                }}
              >
                {match?.mainCriterion?.odds.map((odd) => (
                  <OddButton
                    key={odd.id}
                    odd={odd}
                    style={{ flex: 1 }}
                    criterion={match.mainCriterion!}
                  />
                ))}
              </Section>
            )}

            {/* RealTime Bet Odds */}
            <Section>
              <Text style={{ color: colors.greyLighter, marginBottom: 5 }}>
                Critérios em tempo real
              </Text>
              <Text style={{ color: colors.white, marginBottom: 10, fontWeight: '600' }}>
                Quem irá vencer por Knockout?
              </Text>
            </Section>
          </SafeHorizontalView>

          {match.status === 'ENDED' ? (
            <ThemedText
              style={{ color: colors.greyLighter, textAlign: 'center', paddingVertical: 20 }}
            >
              Match ended
            </ThemedText>
          ) : (
            <MatchCriteriaList matchId={match.id} />
          )}
        </View>
      </MatchBottomSheetProvider>
    </BottomSheetWrapper>
  );
};

export default MatchScreen;
