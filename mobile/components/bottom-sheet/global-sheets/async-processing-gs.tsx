import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SheetManager, SheetProps } from 'react-native-actions-sheet';

import { Button } from '@/components/button';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import ScreenHeader from '@/components/screen-header';
import { ThemedText } from '@/components/ThemedText';
import { colors } from '@/constants/colors';
import { useTimeElapsed } from '@/hooks/use-time-elapsed-messages';
import { ApiError } from '@/utils/http/api-error';
import { withMinimumLoadingDuration } from '@/utils/with-minimum-delay';

import BottomSheet from '..';

export interface AsyncProcessingGlobalSheetProps {
  successTitle: string;
  successMessage?: string;
  errorTitle: string;
  loadingTitle: string;
  onSuccessClose: (fnResult?: unknown | null) => void;
  fnPromise: () => Promise<unknown> | void;
}

const AsyncProcessingGlobalSheet = ({ payload }: SheetProps<'asyncProcessing'>) => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<unknown | null>(null);
  const [fnResult, setFnResult] = useState<unknown | null>(null);

  const { message, isPastMaxTime } = useTimeElapsed({
    breakpoints: [3000, 7000],
    maxTime: 7000,
    enabled: isProcessing,
  });

  const handleClose = () => {
    if (isSuccess) {
      payload?.onSuccessClose?.(fnResult);
    } else {
      SheetManager.hide('asyncProcessing');
    }
  };

  const handlePromise = async () => {
    setIsProcessing(true);
    try {
      const workResult = await withMinimumLoadingDuration(
        () => payload?.fnPromise?.() as Promise<unknown>
      );

      if (workResult.status === 'fulfilled') {
        setFnResult(workResult.value);
        setIsSuccess(true);
      } else {
        setError(workResult.reason);
      }
    } catch (err) {
      // for errors that are not caught by the withMinimumLoadingDuration (synchronous errors)
      setError(err);
      // TODO: show API error to the user, perhaps by injecting the error
      // formmatter through the props
      // if (ApiError.isApiError(err)) {
      //   const error = err.error
      //   // error.details
      // }
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    handlePromise();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { loadingTitle, successTitle, successMessage, errorTitle } = payload ?? {};
  console.log('AsyncProcessingGlobalSheet');

  return (
    <BottomSheet
      containerStyle={StyleSheet.flatten([
        styles.container,
        isSuccess && { backgroundColor: colors.greyDark },
      ])}
      drawUnderStatusBar={true}
      gestureEnabled={false}
    >
      <ScreenHeader
        type="close"
        safeArea={false}
        onClose={() => handleClose()}
        style={{ opacity: !isProcessing || isSuccess || isPastMaxTime ? 1 : 0 }}
      />

      <SafeHorizontalView style={styles.innerContainer}>
        {isProcessing && (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color="white" />
            <ThemedText type="title">{loadingTitle}</ThemedText>
            {message && <ThemedText style={styles.description}>{message}</ThemedText>}
          </View>
        )}

        {isSuccess && (
          <View style={styles.successContainer}>
            <ThemedText type="title">{successTitle}</ThemedText>
            {successMessage && <ThemedText style={styles.description}>{successMessage}</ThemedText>}

            <Button.Root style={styles.closeButton} onPress={() => handleClose()}>
              Close
            </Button.Root>
          </View>
        )}

        {ApiError.isApiError(error) && (
          <View style={styles.successContainer}>
            <ThemedText type="title">{errorTitle}</ThemedText>
            <ThemedText style={styles.description}>{error?.message}</ThemedText>
            <Button.Root style={styles.closeButton} onPress={() => handleClose()}>
              Close
            </Button.Root>
          </View>
        )}
      </SafeHorizontalView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.greyMedium,
  },
  innerContainer: {
    marginTop: '60%',
    alignItems: 'center',
  },
  description: {
    textAlign: 'center',
  },
  processingContainer: {
    gap: 10,
    alignItems: 'center',
  },
  successContainer: {
    gap: 10,
    alignItems: 'center',
    width: '100%',
  },
  closeButton: {
    // position: "absolute",
    // width: 100,
    // top: 0,
    // bottom: 0,
    // marginTop: 30,
  },
});
export default AsyncProcessingGlobalSheet;
