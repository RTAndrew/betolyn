import React from 'react';

import BottomSheet from '@/components/bottom-sheet';
import { ThemedText } from '@/components/ThemedText';
import { useSuspendOdd } from '@/services/odds/odd-mutation';

import { useMatchBottomSheet } from '../context';
import { ISheet } from '../index';
import { IOddSheetData } from '../types';

export const SuspendOddSheet = ({ visible = false }: ISheet) => {
  const { closeAll, currentSheet } = useMatchBottomSheet();
  const { mutateAsync: suspendOdd, isPending } = useSuspendOdd();

  if (!currentSheet?.data) {
    return <ThemedText>Dados da odd não encontrados</ThemedText>;
  }

  const odd = currentSheet?.data as IOddSheetData;

  const handleConfirm = async () => {
    await suspendOdd(odd.id, {
      onSuccess: () => {
        closeAll();
      },
    });
  };

  return (
    <BottomSheet.ModalConfirmation
      destructive
      visible={visible}
      onClose={closeAll}
      onConfirm={handleConfirm}
      onCancelText="Cancelar"
      title="Tem a certeza de que pretende suspender esta odd?"
      description="Os utilizadores deixarão de poder apostar nela."
      onConfirmText={isPending ? 'A suspender...' : 'Suspender'}
    />
  );
};
