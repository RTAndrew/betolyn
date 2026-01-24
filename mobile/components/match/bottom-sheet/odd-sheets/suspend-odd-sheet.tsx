import React from 'react';
import BottomSheet from '@/components/bottom-sheet';
import { useMatchBottomSheet } from '../context';
import { ISheet } from '../index';
import { IOddSheetData } from '../types';
import { useSuspendOdd } from '@/services/odds/odd-mutation';

export const SuspendOddSheet = ({ visible = false }: ISheet) => {
  const { closeAll, currentSheet } = useMatchBottomSheet();
  const { mutateAsync: suspendOdd, isPending } = useSuspendOdd();

  if (!currentSheet?.data) {
    return <> Error: No odd data found </>;
  }

  const odd = currentSheet?.data as IOddSheetData;

  const handleConfirm = async () => {
    await suspendOdd(
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
    title="Are you sure you want to suspend this odd?"
    description="Users will no longer be able to bet on it."
    onConfirmText={isPending ? 'Suspending...' : 'Suspend'}
    />
  );
};
