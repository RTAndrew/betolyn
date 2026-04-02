import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TextStyle, View } from 'react-native';
import { NumberInput } from 'react-native-ui-lib';

import TextInput from '@/components/forms/text-input';
import { ErrorFilled } from '@/components/icons';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import { Skeleton } from '@/components/skeleton';
import { ThemedText } from '@/components/ThemedText';
import { UserCard } from '@/components/user-card';
import { useWizardPrimaryAction } from '@/components/wizard/use-wizard';
import { colors } from '@/constants/colors';
import { useGetMe, useGetSpaceById } from '@/services';

import { formatKwanzaAmount, SpaceAllocateWizardStepProps } from './utils';

const GENERIC_AVATAR = require('@/assets/images/generic-user-profile-image.png');

type AmountProps = SpaceAllocateWizardStepProps<'allocation'>;

export const AllocateAmountStep = ({ data, onChange, setNext, goNext }: AmountProps) => {
  const { id: spaceId } = useLocalSearchParams<{ id: string }>();

  const [amountError, setAmountError] = useState<string | null>(null);

  const { data: user, isPending: isUserPending } = useGetMe({
    queryOptions: {
      refetchOnWindowFocus: true,
      staleTime: 0,
    },
  });
  const userBalanceAvailable = user?.data?.balance?.available ?? 0;

  const {
    data: spaceRes,
    isPending,
    isError,
  } = useGetSpaceById({
    spaceId: spaceId as string,
    queryOptions: { enabled: !!spaceId },
  });

  const space = spaceRes?.data;
  const amount = data?.amount ?? 0;
  const memo = data?.memo ?? '';

  const handleAmountChange = useCallback(
    (next: number) => {
      onChange({ amount: next, memo: memo || undefined });
      if (amountError) setAmountError(null);
    },
    [amountError, memo, onChange]
  );

  const handleMemoChange = useCallback(
    (text: string) => {
      onChange({ amount, memo: text || undefined });
    },
    [amount, onChange]
  );

  const handleNext = useCallback(() => {
    if (amount <= 0) {
      setAmountError('Enter an amount greater than zero');
      return;
    }
    if (amount > userBalanceAvailable) {
      setAmountError('Amount exceeds your available balance');
      return;
    }
    setAmountError(null);
    onChange({ amount, memo: memo || undefined });
    goNext();
  }, [amount, goNext, memo, onChange, userBalanceAvailable]);

  useWizardPrimaryAction(handleNext);

  useEffect(() => {
    setNext?.({
      label: 'Next',
      variant: 'solid',
    });
  }, [setNext]);

  const spaceTitle = useMemo(() => space?.name + ' will receive', [space?.name]);

  /** Large headline: muted when zero; scales down from 1M so long values stay on screen. */
  const amountTextStyle = useMemo((): TextStyle => {
    const isZero = amount === 0;
    const color = isZero ? colors.greyLighter50 : colors.white;
    let fontSize = 68;
    const length = amount.toString().length;
    if (length >= 10) {
      fontSize = 58;
    }
    return {
      fontSize,
      fontWeight: '900',
      color,
    };
  }, [amount]);

  if (!spaceId) {
    return (
      <SafeHorizontalView style={styles.centered}>
        <ThemedText style={styles.muted}>Missing space.</ThemedText>
      </SafeHorizontalView>
    );
  }

  if (isPending) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.greyLighter} size="large" />
      </View>
    );
  }

  if (isError || !space) {
    return (
      <SafeHorizontalView style={styles.centered}>
        <ThemedText style={styles.muted}>Could not load space.</ThemedText>
      </SafeHorizontalView>
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <SafeHorizontalView>
        <UserCard bold showBottomBorder={false} title={spaceTitle} avatarSource={GENERIC_AVATAR} />
      </SafeHorizontalView>

      <View style={styles.divider} />

      <SafeHorizontalView style={styles.amountInputContainer}>
        <NumberInput
          initialNumber={data?.amount ?? 0}
          onChangeNumber={(data) => data.type === 'valid' && handleAmountChange(data.number)}
          /* NumberInput uses a row View; inner TextField only has flexShrink — force grow so the tap target spans the screen. */
          containerStyle={styles.amountInputRow}
          textFieldProps={{
            style: [amountTextStyle, styles.amountInput],
            containerStyle: styles.amountTextFieldContainer,
          }}
        />

        <View style={{ alignItems: 'flex-end' }}>
          {isUserPending ? (
            <Skeleton size={100} />
          ) : (
            <ThemedText style={styles.balanceLine} type="default">
              Balance available:{' '}
              <ThemedText type="defaultSemiBold">
                {formatKwanzaAmount(userBalanceAvailable)} kz
              </ThemedText>
            </ThemedText>
          )}

          {amountError && (
            <View style={styles.errorContainer}>
              <ErrorFilled width={18} height={18} color={'#A8200D'} />
              <ThemedText style={styles.error}>{amountError}</ThemedText>
            </View>
          )}
        </View>
      </SafeHorizontalView>

      <SafeHorizontalView>
        <TextInput
          value={memo}
          label="Memo (optional)"
          style={styles.memoInput}
          placeholder="Add a note"
          onChangeText={handleMemoChange}
          containerStyle={{ marginTop: 40 }}
        />
      </SafeHorizontalView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  balanceLine: {
    textAlign: 'right',
    color: colors.greyLighter,
  },
  memoInput: {
    backgroundColor: colors.greyLight,
    textAlignVertical: 'top',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  muted: {
    color: colors.greyLighter50,
  },
  divider: {
    height: 1,
    backgroundColor: colors.greyLight,
    marginVertical: 12,
  },
  amountInputContainer: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 0,
  },
  amountInputRow: {
    width: '100%',
    flexGrow: 1,
    alignSelf: 'stretch',
  },
  amountTextFieldContainer: {
    flex: 1,
    minWidth: 0,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 8,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#FFD7EF',
  },
  error: {
    color: '#A8200D',
  },
  amountInput: {
    textAlign: 'right',
  },
});
