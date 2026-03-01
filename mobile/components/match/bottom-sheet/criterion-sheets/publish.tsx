import React from 'react';

import BottomSheet from '@/components/bottom-sheet';
import { IMatchCriteriaResponse } from '@/services';
import { usePublishCriterion } from '@/services/criteria/criterion-mutation';

import { useMatchBottomSheet } from '../context';
import { ISheet } from '../index';

export const PublishCriterionSheet = ({ visible = false }: ISheet) => {
  const { closeAll, currentSheet } = useMatchBottomSheet();
  const { mutateAsync: publishCriterion, isPending } = usePublishCriterion();

  if (!currentSheet?.data) {
    return <> Error: No odd data found </>;
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
      onCancelText="Discard"
      title="Publish the market"
      description="The market will be published, and users will be able to bet on it."
      onConfirmText={isPending ? 'Publishing...' : 'Publish'}
    />
  );
};
