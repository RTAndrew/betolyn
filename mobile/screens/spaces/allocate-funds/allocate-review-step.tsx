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
import { formatKwanzaAmount } from '@/utils/number-formatters';

import { SpaceAllocateWizardStepProps } from './utils';

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
      successTitle: 'Fundos alocados',
      loadingTitle: 'A alocar fundos',
      errorTitle: 'Não foi possível alocar fundos',
      successMessage: 'A alocação para o espaço foi enviada com sucesso.',
      onSuccessClose: () => {
        if (spaceId) {
          router.dismissTo(`/(tabs)/spaces/${spaceId}/info`);
        }
      },
      fnPromise: async () => {
        if (!spaceId) {
          throw new Error('ID do espaço em falta.');
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
      label: 'Concluir',
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
            title={`${spaceName} vai receber`}
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
            <Settings.Item title="De" description="Saldo pessoal" suffixIcon={false} />
            <Settings.Item title="Para" description={spaceName} suffixIcon={false} />
            <Settings.Item
              title="Transação"
              description={<Tag color={colors.greyLighter} title="Financiamento" />}
              suffixIcon={false}
            />
          </Settings.ItemGroup>

          {memo && (
            <Settings.ItemGroup title="Observação">
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
