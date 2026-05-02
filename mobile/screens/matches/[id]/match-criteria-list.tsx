import React from 'react';

// import { Collapsible } from '@/components/Collapsible';
import Collapsible from '@/components/collapsible/';
import { useMatchBottomSheet } from '@/components/match/bottom-sheet';
import { OddButton } from '@/components/odd-button';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import { MatchCriteriaSectionSkeleton } from '@/components/skeleton/match-detail-skeleton';
import { ThemedView } from '@/components/ThemedView';
import { colors } from '@/constants/colors';
import { useGetMatchCriteria } from '@/services';

import { Section } from '.';

const MatchCriteriaList = ({ matchId }: { matchId: string }) => {
  const { data, isLoading, isError } = useGetMatchCriteria({ matchId });
  const { pushSheet, canMutateMatchActions, isMatchActionPermissionPending } =
    useMatchBottomSheet();
  const allowMutations = canMutateMatchActions && !isMatchActionPermissionPending;
  const criteria = data?.data;

  if (isLoading)
    return (
      <SafeHorizontalView style={{ paddingHorizontal: 0 }}>
        <MatchCriteriaSectionSkeleton />
      </SafeHorizontalView>
    );

  if (isError || !criteria || criteria.length === 0) return <></>;

  return (
    <ThemedView style={{ backgroundColor: colors.greyMedium, paddingHorizontal: 0 }}>
      <Section style={{ paddingVertical: 0 }}>
        {criteria.map((criteria, index) => (
          <Collapsible
            delayLongPress={200}
            onLongPress={() => {
              if (!allowMutations) return;
              pushSheet({ type: 'criterion-action', data: criteria });
            }}
            open={index === 0}
            key={criteria.id}
            title={criteria.name}
          >
            <ThemedView
              style={{
                backgroundColor: 'transparent',

                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 10,
                paddingVertical: 20,
              }}
            >
              {criteria.odds.map((odd) => (
                <OddButton
                  key={odd.id}
                  odd={odd}
                  criterion={criteria}
                  style={{ minWidth: 'auto', flex: 0, flexGrow: 1 }}
                />
              ))}
            </ThemedView>
          </Collapsible>
        ))}
      </Section>
    </ThemedView>
  );
};

export default MatchCriteriaList;
