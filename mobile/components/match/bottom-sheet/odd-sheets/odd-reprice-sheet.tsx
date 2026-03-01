import React, { useState } from 'react';

import BottomSheet from '@/components/bottom-sheet';
import { Button } from '@/components/button';
import { NumberInput } from '@/components/forms';
import { MatchOptionRow } from '@/components/match/match-option-row';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import { useRepriceOdd } from '@/services';

import { useMatchBottomSheet } from '../context';
import { ISheet } from '../index';
import { IOddSheetData } from '../types';

export const OddRepriceSheet = ({ visible = false }: ISheet) => {
  const { match, closeAll, currentSheet, goBack } = useMatchBottomSheet();
  const odd = currentSheet?.data as IOddSheetData;
  const description = odd.criterion?.name ?? 'Odd';

  const [oddValue, setOddValue] = useState<number>(odd.value);

  const { mutateAsync: repriceOdd, isPending } = useRepriceOdd();

  const handleUpdateOdd = async () => {
    await repriceOdd({
      oddId: odd.id,
      matchId: match.id,
      variables: { value: oddValue },
    });

    closeAll();
  };

  return (
    <BottomSheet onClose={closeAll} visible={visible} closeOnTouchBackdrop={false}>
      <BottomSheet.Header
        onClose={closeAll}
        onPrevious={() => goBack()}
        title={odd.name}
        description={description}
      />

      <SafeHorizontalView style={{ flexDirection: 'column', gap: 24 }}>
        <MatchOptionRow title={odd.name} value={oddValue} onValueChange={(v) => setOddValue(v)}>
          {({ value, status }) => (
            <NumberInput min={0} value={value} status={status} onChange={(v) => setOddValue(v)} />
          )}
        </MatchOptionRow>
      </SafeHorizontalView>

      <SafeHorizontalView style={{ marginTop: 32 }}>
        <Button.Root onPress={handleUpdateOdd} disabled={isPending}>
          {isPending ? 'Saving...' : 'Save'}
        </Button.Root>
      </SafeHorizontalView>
    </BottomSheet>
  );
};
