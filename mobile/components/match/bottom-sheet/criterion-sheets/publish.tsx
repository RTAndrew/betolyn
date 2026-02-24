import React, { useState } from 'react';
import BottomSheet from '@/components/bottom-sheet';
import { useMatchBottomSheet } from '../context';
import { ISheet } from '../index';
import { usePublishCriterion } from '@/services/criteria/criterion-mutation';
import { IMatchCriteriaResponse, IWinningOutcome, useSelectWinningOutcomes } from '@/services';
import { GenericSelectWinningOddsSheet } from './generic-select-winning-odds-sheet';
import { Button } from '@/components/button';

export const PublishCriterionSheet = ({ visible = false }: ISheet) => {
  const { closeAll, currentSheet } = useMatchBottomSheet();
  const { mutateAsync: publishCriterion, isPending } = usePublishCriterion();
  const { mutateAsync: selectWinningOutcomes } = useSelectWinningOutcomes();
  const [showConfirm, setShowConfirm] = useState(false);
  const [outcomes, setOutcomes] = useState<IWinningOutcome[]>([]);

  if (!currentSheet?.data) {
    return <> Error: No odd data found </>;
  }

  const criterion = currentSheet?.data as IMatchCriteriaResponse;

  const handleConfirm = async () => {
    await selectWinningOutcomes({
      criterionId: criterion.id,
      odds: outcomes,
    });
    await publishCriterion(criterion.id);
    closeAll();
  };

  if (showConfirm) {
    return (
      <BottomSheet.ModalConfirmation
        visible={visible}
        onClose={() => {
          setShowConfirm(false);
          closeAll();
        }}
        onConfirm={handleConfirm}
        onCancelText="Discard"
        title={`Publish the market "${criterion.name}"?`}
        description={`The market will be published along with the ${outcomes.length} winning outcomes.`}
        onConfirmText={isPending ? 'Publishing...' : 'Publish'}
      />
    );
  }

  return (
    <GenericSelectWinningOddsSheet
      visible={visible}
      onClose={closeAll}
      title="Select Winner"
      criterion={criterion}
      onChange={setOutcomes}
    >
      <Button.Root onPress={() => setShowConfirm(true)}>Next</Button.Root>
    </GenericSelectWinningOddsSheet>
  );
};
