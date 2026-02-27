import { MatchEventSmallCard } from '@/components/match-event-small-card';
import { ThemedText } from '@/components/ThemedText';
import { useGetMatch } from '@/services';
import { IBet } from '@/stores/bet-slip.store';
import { colors } from '@/constants/colors';
import { router } from 'expo-router';
import React, { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { BetCard } from './bet-card';

interface BetSlipCardProps {
  matchId: string;
  bets: IBet[];
}

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
      <MatchEventSmallCard match={match} onPress={() => router.push(`/matches/${matchId}`)} />

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
    backgroundColor: colors.greyLight,
  },
  body: {
    flexDirection: 'column',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: colors.greyMedium,
  },
});
