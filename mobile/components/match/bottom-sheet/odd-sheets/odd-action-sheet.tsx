import React from 'react';
import BottomSheet from '@/components/bottom-sheet';
import { View } from 'react-native';
import { DollarEuro, Eye, LockClosed, Trash } from '@/components/icons';
import { useMatchBottomSheet } from '../context';
import { ISheet } from '../index';
import { IOddSheetData } from '../types';
import { CriterionStatusEnum, EOddStatus } from '@/types';

const canPublishOdd = (oddStatus: `${EOddStatus}`, criterionStatus: `${CriterionStatusEnum}`) => {
  // console.log('oddStatus', oddStatus);
  console.log('criterionStatus', criterionStatus);
  if (criterionStatus !== 'ACTIVE') return false;

  const ALLOWED_STATUSES: `${EOddStatus}`[] = ['SUSPENDED', 'DRAFT'];
  if (!ALLOWED_STATUSES.includes(oddStatus)) return false;

  return true;
};

const canSuspendOdd = (oddStatus: `${EOddStatus}`, criterionStatus: `${CriterionStatusEnum}`) => {
  if (criterionStatus === 'DRAFT') return false;

  if (oddStatus === 'SUSPENDED') return false;
  if (oddStatus === 'SETTLED') return false;
  if (oddStatus === 'DRAFT') return true;

  return true;
};

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
          disabled={!canPublishOdd(odd.status, odd.criterion?.status ?? 'ACTIVE')}
          text="Publish"
          icon={<Eye width={28} height={28} color="white" />}
          onPress={() => {
            pushSheet({ type: 'odd-publish', data: odd });
          }}
        />

        <BottomSheet.ActionOption
          disabled={!canSuspendOdd(odd.status, odd.criterion?.status ?? 'ACTIVE')}
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
