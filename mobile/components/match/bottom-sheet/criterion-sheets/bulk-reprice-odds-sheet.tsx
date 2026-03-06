import React, { useState } from 'react';

import BottomSheet from '@/components/bottom-sheet';
import { Button } from '@/components/button';
import { NumberInput } from '@/components/forms';
import { MatchOptionRow } from '@/components/match/match-option-row';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import { useRepriceCriterionOdds } from '@/services';
import { IMatchCriteriaResponse } from '@/services/matches/matches-services';

import { useMatchBottomSheet } from '../context';
import { ISheet } from '../index';

interface IOddValue {
  [key: string]: number;
}

export const CriterionBulkRepriceOddsSheet = ({ visible = false }: ISheet) => {
  const { closeAll, currentSheet, goBack, match } = useMatchBottomSheet();
  const { mutateAsync: repriceOdds, isPending } = useRepriceCriterionOdds();

  const [oddValues, setOddValues] = useState<IOddValue>({});

  const handleOddValueChange = (oddId: string, value: number) => {
    setOddValues((prev) => ({ ...prev, [oddId]: value }));
  };

  const criterion = currentSheet?.data as IMatchCriteriaResponse;
  if (!criterion) throw new Error('Criterion not found');

  const handleSave = async () => {
    const oddsDTO = criterion.odds.map((odd) => ({
      id: odd.id,
      value: oddValues[odd.id] ?? odd.value,
    }));

    await repriceOdds(
      {
        criterionId: criterion.id.toString(),
        matchId: match.id,
        variables: {
          odds: oddsDTO,
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
    <BottomSheet onClose={closeAll} visible={visible} closeOnTouchBackdrop={false}>
      <BottomSheet.Header
        onClose={closeAll}
        onPrevious={() => goBack()}
        title={criterion.name}
        description={'Criterion'}
      />

      <SafeHorizontalView style={{ flexDirection: 'column', gap: 24 }}>
        {criterion.odds.map((odd) => (
          <MatchOptionRow
            key={odd.id}
            title={odd.name}
            value={oddValues?.[odd.id] ?? odd.value}
            onValueChange={(value) => handleOddValueChange(odd.id, value)}
          >
            {({ value, status }) => (
              <NumberInput
                min={0}
                value={value}
                status={status}
                onChange={(v) => handleOddValueChange(odd.id, v)}
              />
            )}
          </MatchOptionRow>
        ))}
      </SafeHorizontalView>

      <SafeHorizontalView style={{ marginTop: 32 }}>
        <Button.Root loading={isPending} onPress={handleSave}>
          Save
        </Button.Root>
      </SafeHorizontalView>
    </BottomSheet>
  );
};
