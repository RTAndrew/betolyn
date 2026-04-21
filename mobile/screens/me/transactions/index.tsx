import { router } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import SafeHorizontalView from '@/components/safe-horizontal-view';
import ScreenHeader from '@/components/screen-header';
import { colors } from '@/constants/colors';
import { useGetMyTransactions } from '@/services';

import TransactionCard from './transaction-card';
import { formatTransactionDetail } from './utils';

const TransactionsScreen = () => {
  const { data, isPending, error } = useGetMyTransactions({});

  return (
    <View style={styles.root}>
      <ScreenHeader
        title="Transactions"
        iconContainerColor={colors.greyMedium}
        onClose={() => router.back()}
      />

      <FlatList
        data={data?.data ?? []}
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
    </View>
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
