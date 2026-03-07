import { router } from 'expo-router';
import React from 'react';
import { Dimensions, Image, Platform, ScrollView, Text, View, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MoreVertical, Settings, Sync } from '@/components/icons';
import { MatchBottomSheetProvider, useMatchBottomSheet } from '@/components/match/bottom-sheet';
import { OddButton } from '@/components/odd-button';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import ScreenHeader from '@/components/screen-header';
import { MatchDetailSkeleton } from '@/components/skeleton/match-detail-skeleton';
import { ThemedText } from '@/components/ThemedText';
import { colors } from '@/constants/colors';
import { useGetMatch } from '@/services/matches/match-query';
import { getMatchStatusTag } from '@/utils/get-entity-status-tag';

import MatchCriteria from './match-criteria-list';

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

const MatchScreen = ({ matchId }: { matchId: string }) => {
  const { data: result, refetch, isLoading, isError } = useGetMatch({ matchId: matchId });

  // Ensure there's always enough padding so ScrollView can scroll to top,
  // which enables the formSheet dismiss gesture even when content is short
  // Problem: scrolling to top is not working in Android after reaching the bottom of the screen.
  // The bug is present in Android.
  // https://github.com/software-mansion/react-native-screens/issues/2424
  const screenHeight = Platform.OS === 'android' ? Dimensions.get('window').height * 0.3 : 50;

  if (isLoading) {
    return (
      <SafeAreaView style={{ backgroundColor: colors.greyLight, flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: screenHeight }}>
          <ScreenHeader
            type="down"
            safeArea={false}
            iconContainerColor={colors.greyMedium}
            onClose={() => router.back()}
            style={{
              backgroundColor: colors.greyMedium,
              ...(Platform.OS === 'ios' && { paddingTop: 16 }),
            }}
          />
          <MatchDetailSkeleton />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (isError) return <Text>Error loading match</Text>;
  if (!result?.data) return <Text>Match not found</Text>;

  const match = result.data;

  return (
    <MatchBottomSheetProvider match={match}>
      <View style={{ backgroundColor: colors.greyLight, flex: 1 }}>
        {/* Weird bug on iOS where the screencontent is not shown without this node*/}
        {Platform.OS === 'ios' && (
          <ThemedText style={{ color: colors.white }}> MatchScreen </ThemedText>
        )}

        <ScrollView
          scrollEventThrottle={16}
          stickyHeaderIndices={[0]}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={Platform.OS === 'android'}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: screenHeight }}
        >
          <ScreenHeader
            type="down"
            safeArea={Platform.OS === 'ios' ? false : true}
            iconContainerColor={colors.greyMedium}
            onClose={() => router.back()}
            style={{
              backgroundColor: colors.greyMedium,
            }}
          >
            <ScreenHeader.QuickActions style={{ backgroundColor: colors.greyMedium }}>
              <ScreenHeader.Icon onPress={() => refetch()}>
                <Sync />
              </ScreenHeader.Icon>

              <ScreenHeader.Icon onPress={() => router.replace(`/matches/${matchId}/settings`)}>
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
              <View style={{ marginBottom: 10 }}>{getMatchStatusTag(match.status)}</View>

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
            {match.mainCriterion &&
              match.mainCriterion.status === 'ACTIVE' &&
              match.mainCriterion.odds.length &&
              match.mainCriterion.odds.length > 0 && (
                <Section
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                  }}
                >
                  {match.mainCriterion.odds.map((odd) => (
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
            <MatchCriteria matchId={match.id} />
          )}
        </ScrollView>
      </View>
    </MatchBottomSheetProvider>
  );
};

export default MatchScreen;
