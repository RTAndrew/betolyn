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
      title="Suspender todos os mercados?"
      visible={visible}
      onClose={closeAll}
      onConfirm={handleConfirm}
      onConfirmText={isPending ? 'A suspender...' : 'Suspender tudo'}
    >
      <View style={styles.container}>
        <ThemedText style={styles.description}>
          Isto suspende todos os mercados ativos ou em rascunho deste evento. Os utilizadores não
          poderão fazer novas apostas nesses mercados até nova ação.
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
