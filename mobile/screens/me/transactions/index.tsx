import { router } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';

import EmptyState from '@/components/empty-state';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import ScreenHeader from '@/components/screen-header';
import ScreenWrapper from '@/components/screen-wrapper';
import { Spinner } from '@/components/spinner';
import { colors } from '@/constants/colors';
import { useGetMyTransactions } from '@/services';

import TransactionCard from './transaction-card';
import { formatTransactionDetail } from './utils';

const TransactionsScreen = () => {
  const { data, isPending, isRefetching, error, refetch } = useGetMyTransactions({});

  if (isPending) {
    return (
      <ScreenWrapper safeArea={false} backgroundColor={colors.greyLight}>
        <ScreenHeader
          title="Transações"
          iconContainerColor={colors.greyMedium}
          onClose={() => router.back()}
        />
        <Spinner fullScreen size="large" color={colors.white} />
      </ScreenWrapper>
    );
  }

  if (error || !data?.data) {
    return (
      <ScreenWrapper safeArea={false} backgroundColor={colors.greyLight}>
        <ScreenHeader
          title="Transações"
          iconContainerColor={colors.greyMedium}
          onClose={() => router.back()}
        />
        <EmptyState
          center
          title="Sem transações"
          description="Transações serão exibidas quando houver movimentações na sua conta."
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scrollable={false} safeArea={false} backgroundColor={colors.greyLight}>
      <ScreenHeader
        title="Transações"
        iconContainerColor={colors.greyMedium}
        onClose={() => router.back()}
      />

      <FlatList
        data={data?.data ?? []}
        onRefresh={refetch}
        refreshing={isRefetching}
        ListEmptyComponent={
          <EmptyState
            center
            title="Sem transações"
            description="Transações serão exibidas quando houver movimentações na sua conta."
          />
        }
        renderItem={({ item }) => {
          const { title, amount, icon } = formatTransactionDetail(item.type, item.totalAmount);
          return (
            <SafeHorizontalView>
              <TransactionCard
                title={title}
                description={item.referenceName ?? undefined}
                icon={icon}
                amount={amount}
                onPress={() => router.push(`/(modals)/transactions/${item.id}`)}
              />
            </SafeHorizontalView>
          );
        }}
        contentContainerStyle={styles.contentContainer}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.greyLight,
  },
  contentContainer: {
    gap: 18,
    paddingTop: 16,
    paddingBottom: 100,
  },
});

export default TransactionsScreen;
