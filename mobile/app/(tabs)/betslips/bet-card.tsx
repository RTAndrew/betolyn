import SafeHorizontalView from '@/components/safe-horizontal-view';
import { ThemedText } from '@/components/ThemedText';
import { useGetOddById } from '@/services';
import { IBet } from '@/store/bet-slip.store';
import { StyleSheet, View } from 'react-native';

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
        <ThemedText style={oddStyles.lowPriorityText}>{bet.oddAtPlacement}</ThemedText>
        <ThemedText style={[oddStyles.divider, oddStyles.lowPriorityText]}>•</ThemedText>
        <ThemedText style={oddStyles.stake}>${bet.stake}</ThemedText>
      </View>
    </SafeHorizontalView>
  );
};

const oddStyles = StyleSheet.create({
  root: {
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  border: {
    borderBottomWidth: 1,
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
    fontSize: 16,

    fontWeight: '700',
  },
});
