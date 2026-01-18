import React from 'react';
import BottomSheet from '@/components/bottom-sheet';
import { useMatchBottomSheet } from '../context';
import { ISheet } from '../index';

export const EndMatchSheet = ({ visible = false }: ISheet) => {
  const { closeAll, goBack } = useMatchBottomSheet();

  return (
    <BottomSheet.ModalConfirmation
      title="Are you sure you want to end this match?"
      visible={visible}
      onClose={closeAll}
      onConfirm={() => {
        // TODO: Implement end match logic
        goBack(); // goes back 😅🤌🏿
      }}
      description="If you end the match, other users will no longer be able to bet on it."
    />
  );
};
