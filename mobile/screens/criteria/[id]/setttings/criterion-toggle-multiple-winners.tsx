import React, { useEffect, useState } from 'react';

import Switch from '@/components/forms/switch';
import { Settings } from '@/components/settings';
import { useSetAllowMultipleWinners } from '@/services';
import { CriterionStatusEnum, ICriterion, MatchStatusEnum } from '@/types';

interface CriterionToggleMultipleOddsProps {
  criterion: ICriterion;
}

const canToggleMultipleWinners = (criterion: ICriterion) => {
  if (criterion.match.status === MatchStatusEnum.CANCELLED) return false;

  if (
    [CriterionStatusEnum.VOID, CriterionStatusEnum.SETTLED].includes(
      criterion.status as CriterionStatusEnum
    )
  )
    return false;

  return true;
};

const CriterionToggleMultipleWinners = ({ criterion }: CriterionToggleMultipleOddsProps) => {
  const [state, setState] = useState(criterion.allowMultipleWinners);

  const { mutateAsync: setAllowMultipleWinners, isPending: isUpdatingAllowMultipleWinners } =
    useSetAllowMultipleWinners();

  const handleToggle = async () => {
    setState(!state);
    await setAllowMultipleWinners({
      criterionId: criterion.id,
      allowMultipleWinners: !state,
    }).catch(() => {
      setState((prev) => !prev);
    });
  };

  useEffect(() => {
    setState(criterion.allowMultipleWinners);
  }, [criterion.allowMultipleWinners]);

  return (
    <Settings.Item
      onPress={handleToggle}
      title="Allow multiple winners"
      subtitle="Multiple outcomes will be chosen as winners."
      suffixIcon={
        <Switch
          disabled={!canToggleMultipleWinners(criterion)}
          value={state}
          onChange={handleToggle}
        />
      }
    />
  );
};

export default CriterionToggleMultipleWinners;
