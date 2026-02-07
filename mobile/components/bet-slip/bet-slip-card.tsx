import { ThemedText } from '@/components/ThemedText';
import { useGetMatch } from '@/services';
import { IBet } from '@/stores/bet-slip.store';
import { router } from 'expo-router';
import React, { PropsWithChildren } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { BetCard } from './bet-card';

interface BetSlipCardProps {
  matchId: string;
  bets: IBet[];
}

const Team = ({
  name,
  imageUrl,
  direction = 'row',
}: {
  name: string;
  imageUrl: string;
  direction?: 'row' | 'row-reverse';
}) => {
  return (
    <View style={{ flexDirection: direction, alignItems: 'center', gap: 10 }}>
      <Image source={{ uri: imageUrl }} style={{ width: 30, height: 30 }} />
      <ThemedText style={styles.teamName} className="team-name">
        {name}
      </ThemedText>
    </View>
  );
};

const BetSlipCard = ({ matchId, bets, children }: PropsWithChildren<BetSlipCardProps>) => {
  const { data, isPending, error } = useGetMatch({ matchId });
  const match = data?.data;

  if (isPending) {
    return <ThemedText>Loading...</ThemedText>;
  }

  if (!match || error) {
    return <ThemedText>Error loading match</ThemedText>;
  }

  return (
    <View>
      <Pressable onPress={() => router.push(`/matches/${matchId}`)} style={styles.header}>
        <Team
          name={match.homeTeam.name}
          imageUrl={match.homeTeam.badgeUrl}
          direction="row-reverse"
        />
        <ThemedText style={styles.matchScore}>
          {match.homeTeamScore} : {match.awayTeamScore}
        </ThemedText>
        <Team name={match.awayTeam.name} imageUrl={match.awayTeam.badgeUrl} direction="row" />
      </Pressable>

      <View style={styles.body}>
        {bets.map((bet, idx) => (
          <BetCard key={bet.oddId} bet={bet} match={match} border={idx !== bets.length - 1} />
        ))}
      </View>
    </View>
  );
};

export default BetSlipCard;

const styles = StyleSheet.create({
  root: {
    borderRadius: 8,
    backgroundColor: '#61687E',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#272F3D',
  },

  body: {
    flexDirection: 'column',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: '#485164',
  },
  teamName: {
    fontSize: 12,
    color: '#C7D1E7',
    fontWeight: '400',
  },
  matchScore: {
    fontSize: 12,
    color: '#C7D1E7',
    marginHorizontal: 10,
    fontWeight: '600',
  },
});
