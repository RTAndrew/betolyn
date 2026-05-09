import React from 'react';

import BottomSheet from '@/components/bottom-sheet';
import { ThemedText } from '@/components/ThemedText';
import { usePublishOdd } from '@/services/odds/odd-mutation';
import { CriterionStatusEnum } from '@/types';

import { useMatchBottomSheet } from '../context';
import { ISheet } from '../index';
import { IOddSheetData } from '../types';

const isCriterionActive = (status?: string) => status === CriterionStatusEnum.ACTIVE;

export const PublishOddSheet = ({ visible = false }: ISheet) => {
  const { closeAll, currentSheet } = useMatchBottomSheet();
  const { mutateAsync: publishOdd } = usePublishOdd();

  if (!currentSheet?.data) {
    return <ThemedText> Nenhuma odd encontrada </ThemedText>;
  }

  const odd = currentSheet?.data as IOddSheetData;
  const criterionActive = isCriterionActive(odd.criterion?.status);

  const handleConfirm = async () => {
    if (!criterionActive) return;
    await publishOdd(odd.id, {
      onSuccess: () => {
        closeAll();
      },
    });
  };

  return (
    <BottomSheet.ModalConfirmation
      visible={visible}
      onClose={closeAll}
      onConfirmText={'Publicar'}
      onConfirm={criterionActive ? handleConfirm : undefined}
      onCancelText="Cancelar"
      title="Publicar esta odd?"
      description={
        criterionActive
          ? 'Os utilizadores poderão vê-la e apostar nela.'
          : 'O mercado tem de estar ATIVO antes de esta odd poder ser publicada.'
      }
    />
  );
};
