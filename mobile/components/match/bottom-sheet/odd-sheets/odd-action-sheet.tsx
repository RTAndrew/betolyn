import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import BottomSheet from '@/components/bottom-sheet';
import { DollarEuro, Eye, LockClosed, Settings, Trash } from '@/components/icons';
import { colors } from '@/constants/colors';
import { useGetOddById } from '@/services/odds/odd-query';
import { CriterionStatusEnum, EOddStatus } from '@/types';

import { useMatchBottomSheet } from '../context';
import { ISheet } from '../index';
import { IOddSheetData } from '../types';

const canPublishOdd = (oddStatus: `${EOddStatus}`, criterionStatus: `${CriterionStatusEnum}`) => {
  if (criterionStatus !== 'ACTIVE') return false;

  const ALLOWED_STATUSES: `${EOddStatus}`[] = ['SUSPENDED', 'DRAFT'];
  if (!ALLOWED_STATUSES.includes(oddStatus)) return false;

  return true;
};

const canSuspendOdd = (oddStatus: `${EOddStatus}`, criterionStatus: `${CriterionStatusEnum}`) => {
  if (criterionStatus === 'DRAFT' || criterionStatus === 'SUSPENDED') return false;

  if (oddStatus === 'SUSPENDED') return false;
  if (oddStatus === 'SETTLED') return false;
  if (oddStatus === 'DRAFT') return true;

  return true;
};

export const OddActionSheet = ({ visible = false }: ISheet) => {
  const { pushSheet, closeAll, currentSheet } = useMatchBottomSheet();
  const sheetOdd = currentSheet?.data as IOddSheetData | undefined;

  const { data: oddRes, isPending } = useGetOddById({
    oddId: sheetOdd?.id ?? '',
    queryOptions: { refetchOnMount: 'always' },
  });
  const odd = oddRes?.data ?? sheetOdd;

  if (isPending) {
    return (
      <BottomSheet onClose={closeAll} visible={visible}>
        <BottomSheet.Header
          title={sheetOdd?.name ?? ''}
          description={sheetOdd?.criterion?.name ?? ''}
        />

        <ActivityIndicator size="large" color={colors.greyLighter} />
      </BottomSheet>
    );
  }
  if (!odd) {
    return <> Error: No odd data found </>;
  }

  const description = odd.criterion?.name ?? 'Odd';
  return (
    <BottomSheet onClose={closeAll} visible={visible}>
      <BottomSheet.Header title={odd.name} description={description} />

      <View style={{ flexDirection: 'column', gap: 24 }}>
        <BottomSheet.ActionOption
          text="Cancel & Refund"
          icon={<Trash color="white" />}
          onPress={() => {
            pushSheet({ type: 'match-update-score' });
          }}
        />

        <BottomSheet.ActionOption
          text="Publish"
          disabled={!canPublishOdd(odd.status, odd.criterion?.status ?? 'ACTIVE')}
          icon={<Eye color="white" />}
          onPress={() => {
            pushSheet({ type: 'odd-publish', data: odd });
          }}
        />

        <BottomSheet.ActionOption
          disabled={!canSuspendOdd(odd.status, odd.criterion?.status ?? 'ACTIVE')}
          text="Suspend"
          icon={<LockClosed color="white" />}
          onPress={() => {
            pushSheet({ type: 'odd-suspend', data: odd });
          }}
        />

        <BottomSheet.ActionOption
          text="Settings"
          icon={<Settings color="white" />}
          onPress={() => {
            closeAll();
            router.push(`/odds/${odd.id}/settings`);
          }}
        />

        <BottomSheet.ActionOption
          disabled={odd.status === 'SETTLED' || odd.criterion?.status === 'SETTLED'}
          text="Reprice"
          icon={<DollarEuro color="white" />}
          onPress={() => {
            pushSheet({ type: 'odd-reprice', data: odd });
          }}
        />
      </View>
    </BottomSheet>
  );
};
