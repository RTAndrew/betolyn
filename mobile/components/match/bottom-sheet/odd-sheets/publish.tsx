import React from 'react';
import BottomSheet from '@/components/bottom-sheet';
import { useMatchBottomSheet } from '../context';
import { ISheet } from '../index';
import { IOddSheetData } from '../types';
import { usePublishOdd } from '@/services/odds/odd-mutation';

export const PublishOddSheet = ({ visible = false }: ISheet) => {
  const { closeAll, currentSheet } = useMatchBottomSheet();
  const { mutateAsync: publishOdd, isPending } = usePublishOdd();

  if (!currentSheet?.data) {
    return <> Error: No odd data found </>;
  }

  const odd = currentSheet?.data as IOddSheetData;

  const handleConfirm = async () => {
    await publishOdd(
      odd.id,
      {
        onSuccess: () => {
          closeAll();
        },
      }
    );
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
