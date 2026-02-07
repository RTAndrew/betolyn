import SafeHorizontalView from '@/components/safe-horizontal-view';
import { ThemedText } from '@/components/ThemedText';
import { useGetOddById } from '@/services';
import { IBet } from '@/stores/bet-slip.store';
import { IMatch } from '@/types';
import { Pressable, StyleSheet, View } from 'react-native';
import { UpdateBetBottomsheet } from './update-bet-bottomsheet';
import { useState } from 'react';

interface BetCardProps {
  bet: IBet;
  border?: boolean;
  match: IMatch;
}

export const BetCard = ({ bet, border = true, match }: BetCardProps) => {
  const { data, isPending, error } = useGetOddById({ oddId: bet.oddId });

  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  if (isPending) {
    return <ThemedText>Loading...</ThemedText>;
  }

  if (!data || error) {
    return <ThemedText>Error loading odd</ThemedText>;
  }

  const odd = data?.data;
  return (
    <>
      {isBottomSheetVisible && (
        <UpdateBetBottomsheet
          onClose={() => setIsBottomSheetVisible(false)}
          visible={isBottomSheetVisible}
          stake={bet.stake}
          match={match}
          odd={odd}
        />
      )}

      <Pressable onPress={() => setIsBottomSheetVisible(true)}>
        <SafeHorizontalView style={[styles.root, border && styles.border]}>
          <View>
            <ThemedText>{odd?.name}</ThemedText>
            <ThemedText style={styles.lowPriorityText}>{odd?.criterion?.name} </ThemedText>
          </View>

          <View style={styles.value}>
            <ThemedText style={styles.lowPriorityText}>{bet.oddAtPlacement}</ThemedText>
            <ThemedText style={[styles.divider, styles.lowPriorityText]}>•</ThemedText>
            <ThemedText style={styles.stake}>${bet.stake}</ThemedText>
          </View>
        </SafeHorizontalView>
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
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
