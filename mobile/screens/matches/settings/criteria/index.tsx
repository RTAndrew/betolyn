import { Settings } from '@/components/settings';
import { ThemedText } from '@/components/ThemedText';
import { useGetMatchCriteria } from '@/services';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator } from 'react-native';

interface MatchSettingsCriteriaListProps {
  matchId: string;
}

const MatchSettingsCriteriaList = ({ matchId }: MatchSettingsCriteriaListProps) => {
  const { data, isPending, error } = useGetMatchCriteria({
    matchId,
    queryOptions: {
      networkMode: 'online',
    },
  });

  if (isPending) return <ActivityIndicator size="large" />;

  if (error || !data) return <ThemedText>Error loading criteria</ThemedText>;

  const criteria = data.data;
  return (
    <>
      {criteria.map((criterion) => (
        <Settings.Item
          key={criterion.id}
          title={criterion.name}
          onPress={() => router.push(`/criteria/${criterion.id}/settings`)}
          description={criterion.odds.length.toString()}
        />
      ))}
    </>
  );
};

export default MatchSettingsCriteriaList;
