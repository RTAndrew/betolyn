import { router } from 'expo-router';
import React, { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { MatchEventSmallCard } from '@/components/match-event-small-card';
import { BetSlipCardSkeleton } from '@/components/skeleton/bet-slip-card-skeleton';
import { ThemedText } from '@/components/ThemedText';
import { colors } from '@/constants/colors';
import { useGetMatch } from '@/services';
import { IBet } from '@/stores/bet-slip.store';

import { BetCard } from './bet-card';

interface BetSlipCardProps {
  matchId: string;
  bets: IBet[];
}

const BetSlipCard = ({
  matchId,
  bets,
  children: _children,
}: PropsWithChildren<BetSlipCardProps>) => {
  const { data, isPending, error } = useGetMatch({ matchId });
  const match = data?.data;

  if (isPending) {
    return <BetSlipCardSkeleton betCount={bets.length || 2} />;
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
