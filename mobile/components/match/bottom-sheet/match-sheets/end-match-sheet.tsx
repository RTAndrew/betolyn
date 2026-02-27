import React, { useState } from 'react';
import BottomSheet from '@/components/bottom-sheet';
import { useMatchBottomSheet } from '../context';
import { ISheet } from '../index';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/button';
import { useUpdateMatchStatus, useSuspendAllMatchCriteria } from '@/services/matches/match-mutation';
import { MatchStatusEnum } from '@/types';
import Switch from '@/components/forms/switch';

export const EndMatchSheet = ({ visible = false }: ISheet) => {
  const { closeAll, goBack, match } = useMatchBottomSheet();
  const [suspendAllMarkets, setSuspendAllMarkets] = useState(true);

  const { mutateAsync: updateMatchStatus, isPending: isUpdatingStatus } = useUpdateMatchStatus();
  const { mutateAsync: suspendAllCriteria, isPending: isSuspendingCriteria } = useSuspendAllMatchCriteria();

  const isPending = isUpdatingStatus || isSuspendingCriteria;

  const handleEndMatch = async () => {
    try {
      if (suspendAllMarkets) {
        await suspendAllCriteria({ matchId: match.id });
      }
      
      await updateMatchStatus({
        matchId: match.id,
        variables: { status: MatchStatusEnum.ENDED },
      });
      
      closeAll();
    } catch (error) {
      console.error('Error ending match:', error);
    }
  };

  return (
    <BottomSheet onClose={closeAll} visible={visible}>
      <BottomSheet.Header title="End Match" onClose={closeAll} onPrevious={goBack} />
      <BottomSheet.SafeHorizontalView style={styles.content}>
        <ThemedText style={styles.description}>
          Are you sure you want to end this match? Users will no longer be able to bet on it.
        </ThemedText>

        <View style={styles.optionContainer}>
          <Switch
            value={suspendAllMarkets}
            onChange={setSuspendAllMarkets}
            label="Suspend all markets"
            description="Quickly suspend all active markets to prevent new bets. This prioritizes speed over validation."
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button.Root onPress={closeAll} variant="outline" style={styles.button}>
            Cancel
          </Button.Root>
          <Button.Root onPress={handleEndMatch} variant="solid" style={styles.button} disabled={isPending}>
            {isPending ? 'Ending...' : 'End Match'}
          </Button.Root>
        </View>
      </BottomSheet.SafeHorizontalView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: 'column',
    gap: 20,
  },
  description: {
    fontSize: 14,
    color: '#C7D1E7',
    lineHeight: 20,
  },
  optionContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#2C3342',
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
  },
});
