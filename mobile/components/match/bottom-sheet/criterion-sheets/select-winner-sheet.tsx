import React, { useEffect, useState } from 'react';
import BottomSheet from '@/components/bottom-sheet';
import { Pressable, StyleSheet } from 'react-native';
import { useMatchBottomSheet } from '../context';
import { ISheet } from '../index';
import { IMatchCriteriaResponse } from '@/services/matches/matches-services';
import { IWinningOutcome, useSelectWinningOutcomes } from '@/services';
import { MatchOptionRow } from '../../match-option-row';
import Checkbox from 'react-native-ui-lib/src/components/checkbox';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import { Button } from '@/components/button';
import { ThemedText } from '@/components/ThemedText';

export const CriterionSelectWinningOutcomeSheet = ({ visible = false }: ISheet) => {
  const { closeAll, currentSheet, goBack } = useMatchBottomSheet();
  const { mutateAsync: selectWinningOutcomes, isPending } = useSelectWinningOutcomes();

  const [outcomes, setOutcomes] = useState<IWinningOutcome[]>([]);

  const isWinner = (outcomeId: string) => {
    const [isSelected] = outcomes.filter((outcome) => outcome.id === outcomeId);
    return isSelected?.isWinner;
  };

  const handleWinnerChange = (oddId: string) => {
    if (!criterion.allowMultipleWinners) {
      setOutcomes((prev) =>
        prev.map((outcome) =>
          outcome.id === oddId ? { ...outcome, isWinner: true } : { ...outcome, isWinner: false }
        )
      );
      return;
    }

    const isSelected = isWinner(oddId);

    if (isSelected) {
      setOutcomes((prev) =>
        prev.map((outcome) => (outcome.id === oddId ? { ...outcome, isWinner: false } : outcome))
      );
    } else {
      setOutcomes((prev) =>
        prev.map((outcome) => (outcome.id === oddId ? { ...outcome, isWinner: true } : outcome))
      );
    }
  };

  useEffect(() => {
    if (currentSheet?.data) {
      const criterion = currentSheet.data as IMatchCriteriaResponse;
      setOutcomes(criterion.odds.map((odd) => ({ id: odd.id, isWinner: odd.isWinner })));
    }
  }, [currentSheet?.data]);

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
    <BottomSheet onClose={closeAll} visible={visible}>
      <BottomSheet.Header
        onClose={closeAll}
        onPrevious={() => goBack()}
        title="Select Winner"
        description={criterion.name}
      />

      <SafeHorizontalView style={styles.root}>
        {!criterion.allowMultipleWinners && (
          <ThemedText style={styles.warningText}>
            *Only one winner is allowed for this criterion
          </ThemedText>
        )}

        {criterion.odds.map((odd) => (
          <Pressable
            onPress={() => handleWinnerChange(odd.id)}
            key={odd.id}
            style={[
              styles.oddContainer,
              isWinner(odd.id) ? styles.selectedWinner : styles.unselectedWinner,
            ]}
          >
            <MatchOptionRow title={odd.name} value={odd.value}>
              <Checkbox
                borderRadius={100}
                iconColor="#61687E"
                color={isWinner(odd.id) ? '#3CC5A4' : '#8791A5'}
                value={isWinner(odd.id)}
                onValueChange={(value) => handleWinnerChange(odd.id)}
              />
            </MatchOptionRow>
          </Pressable>
        ))}
      </SafeHorizontalView>

      <SafeHorizontalView style={{ marginTop: 32 }}>
        <Button.Root onPress={handleSave} disabled={isPending}>
          {isPending ? 'Saving...' : 'Save'}
        </Button.Root>
      </SafeHorizontalView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'column',
    gap: 12,
  },
  oddContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,

    borderWidth: 1,
    borderRadius: 12,
  },

  selectedWinner: {
    borderColor: '#3CC5A4',
    backgroundColor: 'rgba(54, 211, 153, 0.12)',
  },
  unselectedWinner: {
    borderColor: '#8791A5',
    // borderColor: "#C7D1E7",
    backgroundColor: 'transparent',
  },
  warningText: {
    marginBottom: 12,
    fontStyle: 'italic',
  },
});
