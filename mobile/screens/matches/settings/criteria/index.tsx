import { router } from 'expo-router';
import React from 'react';

import { Settings } from '@/components/settings';
import { CriteriaListSkeleton } from '@/components/skeleton/criteria-list-skeleton';
import { ThemedText } from '@/components/ThemedText';
import { useGetMatchCriteria } from '@/services';
import { CriterionStatusEnum } from '@/types';

interface MatchSettingsCriteriaListProps {
  matchId: string;
}

const MatchSettingsCriteriaList = ({ matchId }: MatchSettingsCriteriaListProps) => {
  const { data, isPending, error } = useGetMatchCriteria({
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

  if (isPending) return <CriteriaListSkeleton />;

  if (error || !data) return <ThemedText>Error loading criteria</ThemedText>;

  const criteria = data.data;

  return (
    <>
      {criteria.map((criterion) => (
        <Settings.Item
          key={criterion.id}
          title={criterion.name}
          subtitle={'No winner'}
          description={criterion.odds.length.toString()}
          onPress={() => router.push(`/criteria/${criterion.id}/settings`)}
        />
      ))}
    </>
  );
};

export default MatchSettingsCriteriaList;
