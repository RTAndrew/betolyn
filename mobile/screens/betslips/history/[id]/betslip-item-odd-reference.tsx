import React from 'react';

import { Trophy } from '@/components/icons';
import { Settings } from '@/components/settings';
import { Skeleton } from '@/components/skeleton';
import { useGetOddById } from '@/services';

interface BetSlipItemOddReferenceProps {
  oddId: string;
}

const BetSlipItemOddReference = ({ oddId }: BetSlipItemOddReferenceProps) => {
  const { data, isPending, error } = useGetOddById({ oddId: oddId });
  if (isPending) return <Skeleton size={'100%'} borderRadius={12} />;
  if (error || !data) return <></>;

  const odd = data?.data;
  return (
    <Settings.ItemGroup title="Market & Outcome">
      <Settings.Item
        title={odd.criterion.name}
        description={odd.name}
        suffixIcon={odd.isWinner && <Trophy width={18} height={18} />}
      />
    </Settings.ItemGroup>
  );
};

export default BetSlipItemOddReference;
