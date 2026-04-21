import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import BottomSheet from '@/components/bottom-sheet';
import { Add, DollarEuro, Eye, LockClosed, Settings, Trash, Trophy } from '@/components/icons';
import { ThemedText } from '@/components/ThemedText';
import { useGetCriterionById } from '@/services/criteria/criterion-query';
import { IMatchCriteriaResponse } from '@/services/matches/matches-services';
import { getCriterionStatusTag } from '@/utils/get-entity-status-tag';

import { useMatchBottomSheet } from '../context';
import { ISheet } from '../index';

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

  const canView = () => {
    if (criterion.status === 'VOID') return false;
    return true;
  };

  const canSuspend = () => {
    if (!canView()) return false;
    if (criterion.status === 'SUSPENDED') return false;
    if (criterion.status === 'VOID') return false;
    if (criterion.status === 'EXPIRED') return false;
    if (criterion.status === 'SETTLED') return false;

    return true;
  };

  const canPublish = () => {
    if (!canView()) return false;
    if (criterion.status === 'SUSPENDED') return true;
    if (criterion.status === 'DRAFT') return true;

    return false;
  };

  return (
    <BottomSheet onClose={closeAll} visible={visible}>
      <BottomSheet.Header
        title={
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <ThemedText type="defaultSemiBold"> {criterion.name} </ThemedText>
            {getCriterionStatusTag(criterion.status)}
          </View>
        }
        description={'Criterion'}
      />

      <View style={{ flexDirection: 'column', gap: 24 }}>
        <BottomSheet.ActionOption
          disabled={!canView()}
          text="Cancel & Refund"
          icon={<Trash color="white" />}
          onPress={() => {
            pushSheet({
              type: 'cancel-and-refund',
              data: {
                id: criterion.id,
                name: criterion.name,
                type: 'criterion',
              },
            });
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
          disabled={!canView()}
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
          disabled={!canView()}
          text="Select winning outcomes"
          icon={<Trophy color="white" />}
          onPress={() => {
            pushSheet({ type: 'criterion-select-winner', data: criterion });
          }}
        />

        <BottomSheet.ActionOption
          disabled={!canView()}
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
