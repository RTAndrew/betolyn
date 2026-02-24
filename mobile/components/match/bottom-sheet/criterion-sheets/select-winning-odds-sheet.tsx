import React, { useState } from 'react';
import { useMatchBottomSheet } from '../context';
import { ISheet } from '../index';
import { IMatchCriteriaResponse } from '@/services/matches/matches-services';
import { IWinningOutcome, useSelectWinningOutcomes } from '@/services';
import { GenericSelectWinningOddsSheet } from './generic-select-winning-odds-sheet';
import { Button } from '@/components/button';

export const CriterionSelectWinningOutcomeSheet = ({ visible = false }: ISheet) => {
  const { closeAll, currentSheet } = useMatchBottomSheet();
  const { mutateAsync: selectWinningOutcomes, isPending } = useSelectWinningOutcomes();
  const [outcomes, setOutcomes] = useState<IWinningOutcome[]>([]);

  if (!currentSheet?.data) {
    return <> Error: No criterion data found </>;
  }

  const criterion = currentSheet.data as IMatchCriteriaResponse;

  const handleSave = async () => {
    await selectWinningOutcomes(
      {
        criterionId: criterion.id,
        odds: outcomes,
      },
      { onSuccess: () => closeAll() }
    );
  };

  return (
    <GenericSelectWinningOddsSheet
      visible={visible}
      onClose={closeAll}
      title="Select Winner"
      criterion={criterion}
      onChange={setOutcomes}
    >
      <Button.Root onPress={handleSave} disabled={isPending}>
        {isPending ? 'Saving...' : 'Save'}
      </Button.Root>
    </GenericSelectWinningOddsSheet>
  );
};
