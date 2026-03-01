import React from 'react';
import BottomSheet from '@/components/bottom-sheet';
import { View } from 'react-native';
import {
  Add,
  DollarEuro,
  Eye,
  LockClosed,
  MoneyHand,
  Settings,
  Trash,
  Trophy,
} from '@/components/icons';
import { useMatchBottomSheet } from '../context';
import { ISheet } from '../index';
import { IMatchCriteriaResponse } from '@/services/matches/matches-services';
import { useGetCriterionById } from '@/services/criteria/criterion-query';
import { router } from 'expo-router';

export const CriterionActionSheet = ({ visible = false }: ISheet) => {
  const { pushSheet, closeAll, currentSheet } = useMatchBottomSheet();
  const sheetCriterion = currentSheet?.data as IMatchCriteriaResponse | undefined;
  const criterionId = sheetCriterion?.id;
  const { data: criterionRes } = useGetCriterionById({
    criterionId: criterionId ?? '',
    queryOptions: { enabled: !!criterionId },
  });
  const criterion = (criterionId && criterionRes?.data) ?? sheetCriterion;

  if (!criterion) {
    return <> Error: No criterion data found </>;
  }

  const canSuspend = () => {
    if (criterion.status === 'SUSPENDED') return false;
    if (criterion.status === 'VOID') return false;
    if (criterion.status === 'EXPIRED') return false;
    if (criterion.status === 'SETTLED') return false;

    return true;
  };

  const canPublish = () => {
    if (criterion.status === 'SUSPENDED') return true;
    if (criterion.status === 'DRAFT') return true;

    return false;
  };

  return (
    <BottomSheet onClose={closeAll} visible={visible}>
      <BottomSheet.Header title={criterion.name} description={'Criterion'} />

      <View style={{ flexDirection: 'column', gap: 24 }}>
        <BottomSheet.ActionOption
          text="Cancel & Refund"
          icon={<Trash color="white" />}
          onPress={() => {
            pushSheet({ type: 'match-update-score' });
          }}
        />

        <BottomSheet.ActionOption
          text="Lock & Result"
          icon={<MoneyHand color="white" />}
          onPress={() => {
            pushSheet({ type: 'criterion-lock-and-result', data: criterion });
          }}
        />

        <BottomSheet.ActionOption
          disabled={!canPublish()}
          text="Publish"
          icon={<Eye color="white" />}
          onPress={() => {
            pushSheet({ type: 'criterion-publish', data: criterion });
          }}
        />

        <BottomSheet.ActionOption
          disabled={!canSuspend()}
          text="Suspend all outcomes"
          icon={<LockClosed color="white" />}
          onPress={() => {
            pushSheet({ type: 'criterion-suspend', data: criterion });
          }}
        />

        <BottomSheet.ActionOption
          text="Create outcome"
          icon={<Add color="white" />}
          onPress={() => {
            pushSheet({ type: 'criterion-create-odd', data: criterion });
          }}
        />

        <BottomSheet.ActionOption
          text="Settings"
          icon={<Settings color="white" />}
          onPress={() => {
            router.push(`/criteria/${criterion.id}/settings`);
          }}
        />

        <BottomSheet.ActionOption
          text="Select winning outcomes"
          icon={<Trophy color="white" />}
          onPress={() => {
            pushSheet({ type: 'criterion-select-winner', data: criterion });
          }}
        />

        <BottomSheet.ActionOption
          text="Reprice all outcomes"
          icon={<DollarEuro color="white" />}
          onPress={() => {
            pushSheet({ type: 'criterion-reprice-update-odds', data: criterion });
          }}
        />
      </View>
    </BottomSheet>
  );
};
