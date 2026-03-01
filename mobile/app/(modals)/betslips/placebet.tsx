import { useSignals } from '@preact/signals-react/runtime';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import ScreenHeader from '@/components/screen-header';
import ScreenWrapper from '@/components/screen-wrapper';
import { ThemedText } from '@/components/ThemedText';
import { colors } from '@/constants/colors';
import { useTimeElapsed } from '@/hooks/use-time-elapsed-messages';
import { IPlaceBetRequest, usePlaceBet } from '@/services';
import { betSlipStore } from '@/stores/bet-slip.store';
import { ApiError } from '@/utils/http/api-error';

const PlaceBet = () => {
  useSignals();
  const { bets, clearSlip } = betSlipStore;
  const [isProcessing, setIsProcessing] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  const { mutateAsync: placeBet, error } = usePlaceBet();

  const { message, isPastMaxTime } = useTimeElapsed({
    breakpoints: [3000, 7000],
    maxTime: 7000,
    enabled: isProcessing,
  });

  const placeBetVariables: IPlaceBetRequest = {
    type: 'SINGLE',
    items: Object.values(bets.value)
      .flat()
      .map((bet) => {
        return {
          oddId: bet.oddId,
          stake: bet.stake,
          oddValueAtPlacement: bet.oddAtPlacement,
        };
      }),
  };

  const handlePlaceBet = async () => {
    setIsProcessing(true);
    try {
      // const result = await new Promise((resolve) => {
      //   setTimeout(() => {
      //     resolve('success')
      //   }, 11000)
      // })

      await placeBet({ variables: placeBetVariables });
      clearSlip();

      setIsSuccess(true);
    } catch {
      // TODO: set errors to the bet slip
      // if (ApiError.isApiError(err)) {
      //   const error = err.error
      //   // error.details
      // }
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    handlePlaceBet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScreenWrapper safeArea={false} backgroundColor={colors.greyLight}>
      {
        <ScreenHeader
          style={{ opacity: !isProcessing || isSuccess || isPastMaxTime ? 1 : 0 }}
          type="close"
          onClose={() => router.back()}
        />
      }

      <SafeHorizontalView style={styles.container}>
        {isProcessing && (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color="white" />
            <ThemedText type="title">Processing bets</ThemedText>
            {message && <ThemedText>{message}</ThemedText>}
          </View>
        )}

        {isSuccess && (
          <View style={styles.successContainer}>
            <ThemedText type="title">Bet placed successfully</ThemedText>
            <ThemedText>Happy betting!</ThemedText>

            <Button.Root style={styles.closeButton} onPress={() => router.back()}>
              Close
            </Button.Root>
          </View>
        )}

        {ApiError.isApiError(error) && (
          <View style={styles.successContainer}>
            <ThemedText type="title">Not Possible to Place Bet</ThemedText>
            <ThemedText>See the bet slip for more details</ThemedText>
            <Button.Root style={styles.closeButton} onPress={() => router.back()}>
              Close
            </Button.Root>
          </View>
        )}
      </SafeHorizontalView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '60%',
    // justifyContent: 'center',
    alignItems: 'center',

    width: '100%',
  },
  processingContainer: {
    gap: 10,
    alignItems: 'center',
  },
  successContainer: {
    flexGrow: 1,
    gap: 10,
    alignItems: 'center',

    position: 'relative',
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    bottom: 50,
    marginTop: 30,
  },
});

export default PlaceBet;
