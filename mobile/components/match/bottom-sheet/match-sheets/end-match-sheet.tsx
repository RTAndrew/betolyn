import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import BottomSheet from '@/components/bottom-sheet';
import Switch from '@/components/forms/switch';
import { useUpdateMatchStatus } from '@/services/matches/match-mutation';
import { MatchStatusEnum } from '@/types';

import { useMatchBottomSheet } from '../context';
import { ISheet } from '../index';

export const EndMatchSheet = ({ visible = false }: ISheet) => {
  const { closeAll, match } = useMatchBottomSheet();
  const { mutateAsync: updateMatchStatus, isPending } = useUpdateMatchStatus();
  const [suspendAllCriteria, setSuspendAllCriteria] = useState(true);

  const handleConfirm = async () => {
    await updateMatchStatus(
      {
        matchId: match.id,
        variables: {
          status: MatchStatusEnum.ENDED,
          suspendAllCriteria,
        },
      },
      {
        onSuccess: () => {
          closeAll();
        },
      }
    );
  };

  return (
    <BottomSheet.ModalConfirmation
      title="Tem a certeza de que deseja terminar este evento?"
      visible={visible}
      onClose={closeAll}
      onConfirm={handleConfirm}
      onConfirmText={isPending ? 'A terminar evento...' : 'Terminar evento'}
      // description="If you end the match, other users will no longer be able to bet on it."
    >
      <View style={styles.container}>
        <Switch
          label="Suspender todos os mercados deste evento?"
          description="Todos os mercados deste evento serão suspensos imediatamente, impedindo novas apostas."
          value={suspendAllCriteria}
          onChange={(value) => setSuspendAllCriteria(value)}
        />
      </View>
    </BottomSheet.ModalConfirmation>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 22,
  },
});
