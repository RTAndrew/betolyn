import Collapsible from '@/components/collapsible/index';
import { OddButton } from '@/components/odd-button';
import { ThemedView } from '@/components/ThemedView';
import { mockAPI } from '@/mock';
import { useGetMatch, useGetMatchCriteria } from '@/services/matches';
import { useQuery } from '@/utils/http/use-query';
import { useLocalSearchParams } from 'expo-router';
import React, { useMemo, useRef } from 'react';
import { ActivityIndicator, Image, Text, View, ViewProps } from 'react-native';
interface MatchTeamProps {
  name: string;
  imageUrl: string;
}

const MatchCriteria = ({ matchId }: { matchId: string }) => {
  const { data, isLoading, isError } = useGetMatchCriteria({ matchId });
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
      <Section>
        {criteria.map((criteria, index) => (
          <Collapsible open={index === 0} key={criteria.id} title={criteria.name}>
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
  const { data, isLoading, isError } = useGetMatch({ matchId: id as string });
  const match = data?.data;

  if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error loading match</Text>;
  if (!match) return <Text>Match not found</Text>;

  return (
    <View style={{ backgroundColor: '#495064', flex: 1, minHeight: '100%' }}>
      <ThemedView style={{ backgroundColor: 'transparent' }}>
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
                <OddButton key={odd.id} odd={odd} style={{ flex: 1 }} />
              ))}
            </Section>
          )}

        {/* RealTime Bet Odds */}
        <Section style={{ borderBottomWidth: 0.25 }}>
          <Text style={{ color: '#C7D1E7', marginBottom: 5 }}>Critérios em tempo real</Text>
          <Text style={{ color: 'white', marginBottom: 10, fontWeight: '600' }}>
            Quem irá vencer por Knockout?
          </Text>

          {/* <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          <OddButton style={{ flex: 1 }} />
          <OddButton style={{ flex: 1 }} />
        </View> */}
        </Section>
      </ThemedView>

      <MatchCriteria matchId={match.id} />
    </View>
  );
};

export default MatchPage;
