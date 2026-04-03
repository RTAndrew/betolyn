import React from 'react';
import { StyleSheet, View } from 'react-native';

import BottomSheet from '@/components/bottom-sheet';
import { ThemedText } from '@/components/ThemedText';
import { colors } from '@/constants/colors';
import { useSuspendAllMatchCriteria } from '@/services/matches/match-mutation';

import { useMatchBottomSheet } from '../context';
import { ISheet } from '../index';

export const SuspendAllMarketsSheet = ({ visible = false }: ISheet) => {
  const { closeAll, match } = useMatchBottomSheet();
  const { mutateAsync: suspendAll, isPending } = useSuspendAllMatchCriteria();

  const handleConfirm = async () => {
    await suspendAll(match.id);
    closeAll();
  };

  return (
    <BottomSheet.ModalConfirmation
      title="Suspend all markets?"
      visible={visible}
      onClose={closeAll}
      onConfirm={handleConfirm}
      onConfirmText={isPending ? 'Suspending…' : 'Suspend all'}
    >
      <View style={styles.container}>
        <ThemedText style={styles.description}>
          This suspends every active or draft market on this match. Users will not be able to place
          new bets on those markets until you take further action.
        </ThemedText>
      </View>
    </BottomSheet.ModalConfirmation>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 22,
  },
  description: {
    color: colors.greyLighter,
    fontSize: 14,
    lineHeight: 20,
  },
});
