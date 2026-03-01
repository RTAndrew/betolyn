import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Checkbox from 'react-native-ui-lib/src/components/checkbox';

import BottomSheet from '@/components/bottom-sheet';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import { ThemedText } from '@/components/ThemedText';
import { colors } from '@/constants/colors';
import { IWinningOutcome } from '@/services';
import { IMatchCriteriaResponse } from '@/services/matches/matches-services';

import { MatchOptionRow } from '../../match-option-row';
import { useMatchBottomSheet } from '../context';

export interface GenericSelectWinningOddsSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  criterion: IMatchCriteriaResponse;
  onChange: (outcomes: IWinningOutcome[]) => void;
  children: React.ReactNode;
}

export const GenericSelectWinningOddsSheet = ({
  visible,
  onClose,
  title,
  criterion,
  onChange,
  children,
}: GenericSelectWinningOddsSheetProps) => {
  const { goBack } = useMatchBottomSheet();
  const [outcomes, setOutcomes] = useState<IWinningOutcome[]>([]);

  const isWinner = (outcomeId: string) => {
    const [isSelected] = outcomes.filter((outcome) => outcome.id === outcomeId);
    return isSelected?.isWinner;
  };

  const allSelected = outcomes.length > 0 && outcomes.every((outcome) => outcome.isWinner);

  const handleSelectAll = () => {
    if (!criterion.allowMultipleWinners) return;

    const next = allSelected
      ? outcomes.map((o) => ({ ...o, isWinner: false }))
      : outcomes.map((o) => ({ ...o, isWinner: true }));
    setOutcomes(next);
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
    if (visible && criterion?.odds) {
      const initial = criterion.odds.map((odd) => ({ id: odd.id, isWinner: odd.isWinner }));
      setOutcomes(initial);
    }
    // Intentionally sync only when sheet visibility or criterion identity changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, criterion?.id]);

  useEffect(() => {
    if (outcomes.length > 0) {
      onChange(outcomes);
    }
  }, [outcomes, onChange]);

  return (
    <BottomSheet onClose={onClose} visible={visible}>
      <BottomSheet.Header
        onClose={onClose}
        onPrevious={() => goBack()}
        title={title}
        description={criterion.name}
      />

      <SafeHorizontalView style={styles.root}>
        {!criterion.allowMultipleWinners && (
          <ThemedText style={styles.warningText}>
            *Only one winner is allowed for this criterion
          </ThemedText>
        )}

        {criterion.allowMultipleWinners && (
          <Pressable onPress={handleSelectAll}>
            <MatchOptionRow
              title="Select all"
              style={StyleSheet.flatten([styles.oddContainer, styles.selectAllRow])}
            >
              <Checkbox
                borderRadius={100}
                iconColor="white"
                color={allSelected ? colors.primary : '#8791A5'}
                value={allSelected}
                onValueChange={handleSelectAll}
              />
            </MatchOptionRow>

            <View style={styles.divider} />
          </Pressable>
        )}

        {criterion.odds.map((odd) => (
          <Pressable key={odd.id} onPress={() => handleWinnerChange(odd.id)}>
            <MatchOptionRow
              title={odd.name}
              value={odd.value}
              style={StyleSheet.flatten([
                styles.oddContainer,
                isWinner(odd.id) ? styles.selectedWinner : styles.unselectedWinner,
              ])}
            >
              <Checkbox
                borderRadius={100}
                iconColor="white"
                color={isWinner(odd.id) ? colors.primary : '#8791A5'}
                value={isWinner(odd.id)}
                onValueChange={() => handleWinnerChange(odd.id)}
              />
            </MatchOptionRow>
          </Pressable>
        ))}
      </SafeHorizontalView>

      <SafeHorizontalView style={{ marginTop: 32 }}>{children}</SafeHorizontalView>
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
    borderColor: colors.primary,
    backgroundColor: 'rgba(54, 211, 153, 0.12)',
  },
  unselectedWinner: {
    borderColor: '#8791A5',
    backgroundColor: 'transparent',
  },
  selectAllRow: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  divider: {
    height: 0.3,
    marginVertical: 8,
    borderWidth: 0,
    backgroundColor: colors.greyLighter,
  },
  warningText: {
    marginBottom: 12,
    fontStyle: 'italic',
  },
});
