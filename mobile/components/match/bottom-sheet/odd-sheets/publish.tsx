import React from 'react';

import BottomSheet from '@/components/bottom-sheet';
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
    return <> Error: No odd data found </>;
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
      onConfirmText={'Publish'}
      onConfirm={criterionActive ? handleConfirm : undefined}
      onCancelText="Cancel"
      title="Publish this odd?"
      description={
        criterionActive
          ? 'Users will be able to see and bet on it.'
          : 'The criterion must be ACTIVE before this odd can be published.'
      }
    />
  );
};
