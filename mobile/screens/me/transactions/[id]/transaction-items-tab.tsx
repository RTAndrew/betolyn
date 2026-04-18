import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ITransactionItem } from '@/types';

import TransactionCard from '../transaction-card';
import { formatTransactionItemDetail } from '../utils';

interface TransactionItemsTabProps {
  items: ITransactionItem[];
}

const TransactionItemsTab = ({ items }: TransactionItemsTabProps) => {
  return (
    <View style={styles.root}>
      {items.map((item) => {
        const { title, description, amount, icon } = formatTransactionItemDetail(item, 'user');

        return (
          <TransactionCard
            icon={icon}
            key={item.id}
            title={title}
            amount={amount}
            description={description}
          />
        );
      })}
    </View>
  );
};

export default TransactionItemsTab;

const styles = StyleSheet.create({
  root: {
    gap: 12,
  },
});
