import React from 'react';
import BottomSheet from '@/components/bottom-sheet';
import { useMatchBottomSheet } from '../context';
import { ISheet } from '../index';
import { IMatchCriteriaResponse } from '@/services/matches/matches-services';
import { useSuspendCriterion } from '@/services';
import { CriterionStatusEnum } from '@/types';

export const CriterionSuspendSheet = ({ visible = false }: ISheet) => {
  const { closeAll, currentSheet, match } = useMatchBottomSheet();
  const { mutateAsync: suspendCriterion, isPending } = useSuspendCriterion();

  if (!currentSheet?.data) {
    return <> Error: No criterion data found </>;
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
      title="Are you sure you want to suspend all odds?"
      visible={visible}
      onClose={closeAll}
      onConfirm={handleConfirm}
      description="If you suspend this criterion, users will no longer be able to bet on it."
      onConfirmText={isPending ? 'Suspending...' : 'Suspend'}
      onCancelText="Cancel"
    />
  );
};
