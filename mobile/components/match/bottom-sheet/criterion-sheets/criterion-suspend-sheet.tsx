import React from 'react';

import BottomSheet from '@/components/bottom-sheet';
import { ThemedText } from '@/components/ThemedText';
import { useSuspendCriterion } from '@/services';
import { IMatchCriteriaResponse } from '@/services/matches/matches-services';
import { CriterionStatusEnum } from '@/types';

import { useMatchBottomSheet } from '../context';
import { ISheet } from '../index';

export const CriterionSuspendSheet = ({ visible = false }: ISheet) => {
  const { closeAll, currentSheet, match } = useMatchBottomSheet();
  const { mutateAsync: suspendCriterion, isPending } = useSuspendCriterion();

  if (!currentSheet?.data) {
    return <ThemedText>Nenhum mercado encontrado </ThemedText>;
  }

  const criterion = currentSheet?.data as IMatchCriteriaResponse;

  const handleConfirm = async () => {
    await suspendCriterion(
      {
        criterionId: criterion.id.toString(),
        matchId: match.id,
        variables: {
          status: CriterionStatusEnum.SUSPENDED,
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
      title="Tem a certeza de que pretende suspender todas as odds?"
      visible={visible}
      onClose={closeAll}
      onConfirm={handleConfirm}
      description="Se suspender este mercado, os utilizadores deixarão de poder apostar nele."
      onConfirmText={isPending ? 'A suspender...' : 'Suspender'}
      onCancelText="Cancelar"
    />
  );
};
