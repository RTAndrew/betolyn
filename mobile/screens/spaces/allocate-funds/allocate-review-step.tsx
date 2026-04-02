import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import SafeHorizontalView from '@/components/safe-horizontal-view';
import { Settings } from '@/components/settings';
import Tag from '@/components/tags';
import { ThemedText } from '@/components/ThemedText';
import { UserCard } from '@/components/user-card';
import { useWizardPrimaryAction } from '@/components/wizard/use-wizard';
import { colors } from '@/constants/colors';
import { SpaceService, useGetSpaceById } from '@/services';

import { formatKwanzaAmount, SpaceAllocateWizardStepProps } from './utils';

const GENERIC_AVATAR = require('@/assets/images/generic-user-profile-image.png');

type ReviewProps = SpaceAllocateWizardStepProps<'review'>;

export const AllocateReviewStep = ({ allData, setNext, runAsyncSubmit }: ReviewProps) => {
  const { id: spaceId } = useLocalSearchParams<{ id: string }>();
  const { data: spaceRes } = useGetSpaceById({
    spaceId: spaceId as string,
    queryOptions: { enabled: !!spaceId },
  });

  const spaceName = spaceRes?.data?.name ?? '—';
  const allocation = allData?.allocation;
  const amount = allocation?.amount ?? 0;
  const memo = allocation?.memo?.trim();

  const summary = useMemo(
    () => ({
      amountLabel: formatKwanzaAmount(amount),
      memo: memo || '—',
    }),
    [amount, memo]
  );

  const handleFinish = useCallback(() => {
    runAsyncSubmit?.({
      successTitle: 'Funds allocated',
      loadingTitle: 'Allocating funds',
      errorTitle: 'Could not allocate funds',
      successMessage: 'Your allocation to the space was submitted successfully.',
      onSuccessClose: () => {
        if (spaceId) {
          router.push(`/spaces/${spaceId}`);
        }
      },
      fnPromise: async () => {
        if (!spaceId) {
          throw new Error('Missing space id.');
        }

        await SpaceService.allocateFunding(spaceId, {
          amount,
          memo,
        });
        return { spaceId, amount, memo };
      },
    });
  }, [amount, memo, spaceId]);

  useWizardPrimaryAction(handleFinish);

  useEffect(() => {
    setNext?.({
      label: 'Finish',
      variant: 'solid',
    });
  }, [setNext]);

  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
      <SafeHorizontalView>
        <View style={styles.hero}>
          <UserCard
            bold
            direction="column"
            showBottomBorder={false}
            avatarSource={GENERIC_AVATAR}
            title={`${spaceName} will receive`}
            style={{
              alignContent: 'center',
              alignItems: 'center',
            }}
          />
          <ThemedText style={styles.heroAmount} type="title">
            {summary.amountLabel}
          </ThemedText>
          <ThemedText type="default">Kwanzas</ThemedText>
        </View>

        <View style={{ gap: 16 }}>
          <Settings.ItemGroup>
            <Settings.Item title="From" description="Personal balance" suffixIcon={false} />
            <Settings.Item title="To" description={spaceName} suffixIcon={false} />
            <Settings.Item
              title="Transaction"
              description={<Tag color={colors.greyLighter} title="Funding" />}
              suffixIcon={false}
            />
          </Settings.ItemGroup>

          {memo && (
            <Settings.ItemGroup title="Memo">
              <Settings.Item title={summary.memo} suffixIcon={false} />
            </Settings.ItemGroup>
          )}
        </View>
      </SafeHorizontalView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  hero: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  heroAmount: {
    fontSize: 68,
    lineHeight: 72,
    fontWeight: '900',
    color: colors.white,
  },
});
