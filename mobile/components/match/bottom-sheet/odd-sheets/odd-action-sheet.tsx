import React from 'react';
import BottomSheet from '@/components/bottom-sheet';
import { View } from 'react-native';
import { DollarEuro, LockClosed, MoneyHand, Trash } from '@/components/icons';
import { useMatchBottomSheet } from '../context';
import { ISheet } from '../index';
import { IOddSheetData } from '../types';

export const OddActionSheet = ({ visible = false }: ISheet) => {
  const { pushSheet, closeAll, currentSheet } = useMatchBottomSheet();

  if (!currentSheet?.data) {
    return <> Error: No odd data found </>;
  }

  const odd = currentSheet?.data as IOddSheetData;
  const description = odd.criterion?.name ?? 'Odd';
  return (
    <BottomSheet onClose={closeAll} visible={visible}>
      <BottomSheet.Header title={odd.name} description={description} />

      <View style={{ flexDirection: 'column', gap: 24 }}>
        <BottomSheet.ActionOption
          text="Cancel & Refund"
          onPress={() => {
            pushSheet({ type: 'match-update-score' });
          }}
          icon={<Trash width={28} height={28} color="white" />}
        />
        <BottomSheet.ActionOption
          text="Edit"
          icon={<MoneyHand width={28} height={28} color="white" />}
        />
        <BottomSheet.ActionOption
          text="Suspend"
          icon={<LockClosed width={28} height={28} color="white" />}
          onPress={() => {
            pushSheet({ type: 'odd-suspend', data: odd });
          }}
        />

        <BottomSheet.ActionOption
          text="Reprice"
          icon={<DollarEuro width={28} height={28} color="white" />}
          onPress={() => {
            pushSheet({ type: 'odd-reprice', data: odd });
          }}
        />
      </View>
    </BottomSheet>
  );
};
