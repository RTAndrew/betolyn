import React from 'react';
import BottomSheet from '@/components/bottom-sheet';
import { View } from 'react-native';
import { DollarEuro, LockClosed, MoneyHand, Trash } from '@/components/icons';
import { useMatchBottomSheet } from '../context';
import { ISheet } from '../index';
import { IMatchCriteriaResponse } from '@/services/matches/matches-services';

export const CriterionActionSheet = ({ visible = false }: ISheet) => {
  const { pushSheet, closeAll, currentSheet } = useMatchBottomSheet();

  if (!currentSheet?.data) {
    return <> Error: No criterion data found </>;
  }

  const criterion = currentSheet?.data as IMatchCriteriaResponse;

  return (
    <BottomSheet onClose={closeAll} visible={visible}>
      <BottomSheet.Header title={criterion.name} description={"Criterion"} />

      <View style={{ flexDirection: 'column', gap: 24 }}>
        <BottomSheet.ActionOption
          text="Cancel & Refund"
          onPress={() => {
            pushSheet({ type: 'match-update-score' });
          }}
          icon={<Trash width={28} height={28} color="white" />}
        />
        <BottomSheet.ActionOption
          text="Lock & Result"
          icon={<MoneyHand width={28} height={28} color="white" />}
          onPress={() => {
            pushSheet({ type: 'criterion-lock-and-result', data: criterion });
          }}
        />
        <BottomSheet.ActionOption
          text="Suspend all odds"
          icon={<LockClosed width={28} height={28} color="white" />}
          onPress={() => {
            pushSheet({ type: 'criterion-suspend', data: criterion });
          }}
        />

        <BottomSheet.ActionOption
          text="Reprice all odds"
          icon={<DollarEuro width={28} height={28} color="white" />}
          onPress={() => {
            pushSheet({ type: 'criterion-reprice-update-odds', data: criterion });
          }}
        />
      </View>
    </BottomSheet>
  );
};
