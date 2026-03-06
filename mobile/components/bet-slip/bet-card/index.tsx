import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { Lock } from '@/components/icons';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import { BetSlipBetCardSkeleton } from '@/components/skeleton/bet-slip-bet-card-skeleton';
import { ThemedText } from '@/components/ThemedText';
import { colors } from '@/constants/colors';
import { useGetOddById } from '@/services';
import { betSlipStore, IBet } from '@/stores/bet-slip.store';
import { IMatch } from '@/types';

import { UpdateBetBottomsheet } from './update-bet-bottomsheet';

interface BetCardProps {
  bet: IBet;
  border?: boolean;
  match: IMatch;
}

export const BetCard = ({ bet, border = true, match }: BetCardProps) => {
  const { data, isPending, error } = useGetOddById({ oddId: bet.oddId });

  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  if (isPending) {
    return <BetSlipBetCardSkeleton border={border} />;
  }

  if (!data || error) {
    return <ThemedText>Error loading odd</ThemedText>;
  }

  const odd = data?.data;
  const isLocked = odd?.criterion?.status !== 'ACTIVE' || odd?.status !== 'ACTIVE';
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

      <Pressable
        onPress={() => {
          if (!isLocked) {
            setIsBottomSheetVisible(true);
            return;
          }

          Alert.alert(
            'Outcome Locked',
            'The outcome is no longer available. Remove it to continue placing bets.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Remove',
                style: 'destructive',
                onPress: () => {
                  betSlipStore.removeOddSlip(match.id, bet.oddId);
                },
              },
            ]
          );
        }}
      >
        <SafeHorizontalView
          style={[styles.root, border && styles.border, isLocked && styles.disabled]}
        >
          <View>
            <ThemedText>{odd?.name}</ThemedText>
            <ThemedText style={styles.lowPriorityText}>{odd?.criterion?.name} </ThemedText>
          </View>

          <View style={styles.value}>
            {isLocked ? (
              <>
                <Lock color={colors.greyLighter} />
              </>
            ) : (
              <>
                <ThemedText style={styles.lowPriorityText}>{bet.oddAtPlacement}</ThemedText>
                <ThemedText style={[styles.divider, styles.lowPriorityText]}>•</ThemedText>
                <ThemedText style={styles.stake}>${bet.stake}</ThemedText>
              </>
            )}
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
    alignItems: 'center',
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: colors.greyLight,
  },
  value: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    color: colors.greyLighter,
    marginHorizontal: 4,
  },
  lowPriorityText: {
    color: colors.greyLighter,
  },
  stake: {
    fontSize: 16,
    color: colors.complementary2,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.5,
    position: 'relative',
  },
});
