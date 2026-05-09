import { router } from 'expo-router';
import React, { useEffect } from 'react';

import { Settings } from '@/components/settings';
import { CriteriaListSkeleton } from '@/components/skeleton/criteria-list-skeleton';
import { ThemedText } from '@/components/ThemedText';
import { useGetMatchCriteria } from '@/services';
import { CriterionStatusEnum } from '@/types';

interface MatchSettingsCriteriaListProps {
  matchId: string;
  shouldRefetch?: boolean;
}

const MatchSettingsCriteriaList = ({
  matchId,
  shouldRefetch = false,
}: MatchSettingsCriteriaListProps) => {
  const { data, isPending, error, refetch } = useGetMatchCriteria({
    matchId,
    queryParams: {
      status: [
        CriterionStatusEnum.SETTLED,
        CriterionStatusEnum.ACTIVE,
        CriterionStatusEnum.DRAFT,
        CriterionStatusEnum.SUSPENDED,
        CriterionStatusEnum.VOID,
      ],
    },
    queryOptions: {
      refetchOnMount: 'always',
    },
  });

  useEffect(
    function refetchMatchCriteriaWhenTriggered() {
      if (!shouldRefetch) return;
      refetch();
    },
    [shouldRefetch, refetch]
  );

  if (isPending) return <CriteriaListSkeleton />;

  if (error || !data) return <ThemedText>Erro ao carregar mercados</ThemedText>;

  const criteria = data.data;
  if (criteria.length === 0) return <></>;

  return (
    <Settings.ItemGroup title="Mercados">
      {criteria.map((criterion) => (
        <Settings.Item
          key={criterion.id}
          title={criterion.name}
          subtitle={'Sem vencedor'}
          description={criterion.odds.length.toString()}
          onPress={() => router.push(`/criteria/${criterion.id}/settings`)}
        />
      ))}
    </Settings.ItemGroup>
  );
};

export default MatchSettingsCriteriaList;
