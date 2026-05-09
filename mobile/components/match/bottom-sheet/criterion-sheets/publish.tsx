import React from 'react';

import BottomSheet from '@/components/bottom-sheet';
import { ThemedText } from '@/components/ThemedText';
import { IMatchCriteriaResponse } from '@/services';
import { usePublishCriterion } from '@/services/criteria/criterion-mutation';

import { useMatchBottomSheet } from '../context';
import { ISheet } from '../index';

export const PublishCriterionSheet = ({ visible = false }: ISheet) => {
  const { closeAll, currentSheet } = useMatchBottomSheet();
  const { mutateAsync: publishCriterion, isPending } = usePublishCriterion();

  if (!currentSheet?.data) {
    return <ThemedText> Nenhum mercado encontrado </ThemedText>;
  }

  const criterion = currentSheet?.data as IMatchCriteriaResponse;

  const handleConfirm = async () => {
    await publishCriterion(criterion.id);
    closeAll();
  };

  return (
    <BottomSheet.ModalConfirmation
      visible={visible}
      onClose={closeAll}
      onConfirm={handleConfirm}
      onCancelText="Descartar"
      title="Publicar mercado"
      description="O mercado será publicado e os utilizadores poderão apostar nele."
      onConfirmText={isPending ? 'A publicar...' : 'Publicar'}
    />
  );
};
