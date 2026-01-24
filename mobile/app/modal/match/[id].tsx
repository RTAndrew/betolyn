import Collapsible from '@/components/collapsible/index';
import { OddButton } from '@/components/odd-button';
import ScreenTopBar from '@/components/screen-topbar';
import { ThemedView } from '@/components/ThemedView';
import { useGetMatch, useGetMatchCriteria } from '@/services/matches/match-query';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Dimensions, Image, Platform, ScrollView, Text, View, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MatchBottomSheetProvider, useMatchBottomSheet } from '@/components/match/bottom-sheet';

interface MatchTeamProps {
  name: string;
  imageUrl: string;
}

const MatchCriteria = ({ matchId }: { matchId: string }) => {
  const { data, isLoading, isError } = useGetMatchCriteria({ matchId });
  const { pushSheet } = useMatchBottomSheet();
  const criteria = data?.data;

  if (isLoading)
    return (
      <ThemedView style={{ backgroundColor: '#495064', paddingHorizontal: 0 }}>
        <Section>
          <ActivityIndicator size="large" color="#C7D1E7" />
        </Section>
      </ThemedView>
    );

  if (isError || !criteria || criteria.length === 0) return <></>;

  return (
    <ThemedView style={{ backgroundColor: '#495064', paddingHorizontal: 0 }}>
      <Section style={{ paddingVertical: 0 }}>
        {criteria.map((criteria, index) => (
          <Collapsible onLongPress={() => {
            pushSheet({ type: 'criterion-action', data: criteria });
          }} open={index === 0} key={criteria.id} title={criteria.name}>
            <ThemedView
              style={{
                backgroundColor: 'transparent',

                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 10,
                paddingVertical: 20,
              }}
            >
              {criteria.odds.map((odd) => (
                <OddButton
                  key={odd.id}
                  odd={odd}
                  criterion={criteria}
                  style={{ minWidth: 'auto', flex: 0, flexGrow: 1 }}
                />
              ))}
            </ThemedView>
          </Collapsible>
        ))}
      </Section>
    </ThemedView>
  );
};

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

const Section = ({ children, style }: ViewProps) => {
  return (
    <View
      style={[
        {
          paddingVertical: 20,
          borderColor: '#C7D1E7',
          borderTopWidth: 0.25,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const MatchPage = () => {
  const { id } = useLocalSearchParams();
  const { data: result, refetch, isLoading, isError } = useGetMatch({ matchId: id as string });

  // Ensure there's always enough padding so ScrollView can scroll to top,
  // which enables the formSheet dismiss gesture even when content is short
  // Problem: scrolling to top is not working in Android after reaching the bottom of the screen.
  // The bug is present in Android.
  // https://github.com/software-mansion/react-native-screens/issues/2424
  const screenHeight = Platform.OS === 'android' ? Dimensions.get('window').height * 0.3 : 50;

  if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error loading match</Text>;
  if (!result?.data) return <Text>Match not found</Text>;

  const match = result.data;

  return (
    <MatchBottomSheetProvider match={match}>
      <SafeAreaView style={{ backgroundColor: '#61687E', flex: 1 }}>
        <ScrollView
          scrollEventThrottle={16}
          stickyHeaderIndices={[0]}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={Platform.OS === 'android'}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: screenHeight }}
        >
          <ScreenTopBar style={{ backgroundColor: '#495064' }} />
          <Text onPress={() => refetch()}> Refreshe </Text>

          <ThemedView style={{ backgroundColor: '#495064' }}>
          {/* Highlight */}
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              paddingVertical: 30,
            }}
          >
            <Text style={{ color: '#C7D1E7', marginBottom: 10 }}>UFC</Text>

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
                  color: 'white',
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
                  <OddButton key={odd.id} odd={odd} style={{ flex: 1 }} criterion={match.mainCriterion!} />
                ))}
              </Section>
            )}

          {/* RealTime Bet Odds */}
          <Section>
            <Text style={{ color: '#C7D1E7', marginBottom: 5 }}>Critérios em tempo real</Text>
            <Text style={{ color: 'white', marginBottom: 10, fontWeight: '600' }}>
              Quem irá vencer por Knockout?
            </Text>
          </Section>
        </ThemedView>

        <MatchCriteria matchId={match.id} />
      </ScrollView>
    </SafeAreaView>
    </MatchBottomSheetProvider>
  );
};

export default MatchPage;
