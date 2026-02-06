import React from 'react';
import BottomSheet from '@/components/bottom-sheet';
import { useMatchBottomSheet } from '../context';
import { ISheet } from '../index';
import { usePublishCriterion } from '@/services/criteria/criterion-mutation';
import { IMatchCriteriaResponse } from '@/services';

export const PublishCriterionSheet = ({ visible = false }: ISheet) => {
  const { closeAll, currentSheet } = useMatchBottomSheet();
  const { mutateAsync: publishCriterion, isPending } = usePublishCriterion();

  if (!currentSheet?.data) {
    return <> Error: No odd data found </>;
  }

  const criterion = currentSheet?.data as IMatchCriteriaResponse;

  const handleConfirm = async () => {
    await publishCriterion(criterion.id, {
      onSuccess: () => {
        closeAll();
      },
    });
  };

  return (
    <BottomSheet.ModalConfirmation
      visible={visible}
      onClose={closeAll}
      onConfirm={handleConfirm}
      onCancelText="Cancel"
      title="Publish this odd?"
      description="Users will be able to see and bet on it."
      onConfirmText={isPending ? 'Publishing...' : 'Publish'}
    />
  );
};
