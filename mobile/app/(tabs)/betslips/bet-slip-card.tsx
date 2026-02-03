import SafeHorizontalView from '@/components/safe-horizontal-view';
import { ThemedText } from '@/components/ThemedText';
import { useGetMatch, useGetOddById } from '@/services';
import { IBet } from '@/store/bet-slip';
import React, { PropsWithChildren } from 'react'
import { Image, StyleSheet, View } from 'react-native'

interface BetSlipCardProps {
  matchId: string;
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

interface BetCardProps {
  bet: IBet;
  border?: boolean;
}

export const BetCard = ({ bet, border = true }: BetCardProps) => {
  const { data, isPending, error } = useGetOddById({ oddId: bet.oddId });

  if (isPending) {
    return <ThemedText>Loading...</ThemedText>;
  }

  if (!data || error) {
    return <ThemedText>Error loading odd</ThemedText>;
  }

  const odd = data?.data;
  return (
    <SafeHorizontalView style={[oddStyles.root, border && oddStyles.border]}>
      <View>
        <ThemedText>{odd?.name}</ThemedText>
        <ThemedText style={oddStyles.lowPriorityText}>{odd?.criterion?.name} </ThemedText>
      </View>

      <View style={oddStyles.value}>
        <ThemedText style={oddStyles.lowPriorityText}>{odd?.value}</ThemedText>
        <ThemedText style={[oddStyles.divider, oddStyles.lowPriorityText]}>•</ThemedText>
        <ThemedText style={oddStyles.stake}>${bet.amount}</ThemedText>
      </View>
    </SafeHorizontalView>
  )
}

const oddStyles = StyleSheet.create({
  root: {
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  border: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#61687E',
  },
  value: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    color: '#C7D1E7',
    marginHorizontal: 4,
  },
  lowPriorityText: {
    color: '#C7D1E7',
  },
  stake: {
    fontWeight: '700',
  },
});

const BetSlipCard = ({ matchId, children }: PropsWithChildren<BetSlipCardProps>) => {
  const { data, isPending, error } = useGetMatch({ matchId });
  const matches = data?.data;

  if (isPending) {
    return <ThemedText>Loading...</ThemedText>;
  }

  if (!matches || error) {
    return <ThemedText>Error loading matches</ThemedText>;
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Team name={matches.homeTeam.name} imageUrl={matches.homeTeam.badgeUrl} direction='row-reverse' />
        <ThemedText style={styles.matchScore}> {matches.homeTeamScore} : {matches.awayTeamScore} </ThemedText>
        <Team name={matches.awayTeam.name} imageUrl={matches.awayTeam.badgeUrl} direction='row' />
      </View>

      <View style={styles.body}>
        {children}
      </View>
    </View>
  )
}

export default BetSlipCard

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
  }
});