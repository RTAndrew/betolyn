import Collapsible from '@/components/collapsible/index';
import { OddButton } from '@/components/odd-button';
import { ThemedView } from '@/components/ThemedView';
import { mockAPI } from '@/mock';
import { useQuery } from '@/utils/http/use-query';
import { useLocalSearchParams } from 'expo-router';
import React, { useMemo, useRef } from 'react';
import { Image, Text, View, ViewProps } from 'react-native';
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
  const { match, criteria } = mockAPI.getMatchById(Number(id));

  if (!match) {
    return <Text>Match not found</Text>;
  }

  return (
    <View style={{ backgroundColor: '#495064', flex: 1 }}>
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
            <MatchTeam name={match.home_team} imageUrl={match.home_team_image_url} />
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: 'white',
                transform: [{ translateY: 35 }],
              }}
            >
              vs
            </Text>
            <MatchTeam name={match.away_team} imageUrl={match.away_team_image_url} />
          </View>
        </View>

        {/* Main Bet */}
        {match.main_criteria.odds.length && match.main_criteria.odds.length > 0 && (
          <Section
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
            }}
          >
            {match.main_criteria.odds.map((odd) => (
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

      <ThemedView style={{ backgroundColor: '#495064', paddingHorizontal: 0 }}>
        {/* Criteria */}
        {criteria.length > 0 && (
          <Section>
            {criteria.map((criteria, index) => (
              <Collapsible open={index === 0} key={criteria.id} title={criteria.name}>
                <ThemedView
                  style={{
                    backgroundColor: 'transparent',

                    display: 'flex',
                    flexDirection: 'row',
                    gap: 10,
                    paddingVertical: 20,
                  }}
                >
                  {criteria.odds.map((odd) => (
                    <OddButton key={odd.id} odd={odd} style={{ minWidth: '30%' }} />
                  ))}
                </ThemedView>
              </Collapsible>
            ))}
          </Section>
        )}
      </ThemedView>
    </View>
  );
};

export default MatchPage;
