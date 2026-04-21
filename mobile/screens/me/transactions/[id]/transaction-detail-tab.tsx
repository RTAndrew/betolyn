import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Settings } from '@/components/settings';
import { ThemedText } from '@/components/ThemedText';
import { ITransaction } from '@/types';

import TransactionScreenGeneric from '../transaction-screen-generic';
import { formatTransactionDetail } from '../utils';
import TransactionLinkedReference from './transaction-linked-reference';

interface TransactionDetailsTabProps {
  transaction: ITransaction;
}

const TransactionDetailsTab = ({ transaction }: TransactionDetailsTabProps) => {
  const transactionDetail = useMemo(() => {
    return formatTransactionDetail(transaction?.type, transaction?.totalAmount ?? 0);
  }, [transaction]);
  return (
    <View style={styles.root}>
      <Settings.ItemGroup title="Details">
        <Settings.Item title="Type" description={transactionDetail.title} />
        {transaction.referenceName && (
          <Settings.Item title="Reference" description={transaction.referenceName} />
        )}
        <Settings.Item title="Date" description={transaction.createdAt} />

        {transaction.type === 'TRANSFER' && (
          <Settings.Item title="Sender" description={transaction.createdBy?.username} />
        )}
      </Settings.ItemGroup>

      {transaction.memo && (
        <Settings.ItemGroup title="Memo">
          <Settings.Item title={<ThemedText> {transaction.memo} </ThemedText>} />
        </Settings.ItemGroup>
      )}

      <TransactionLinkedReference
        reference={transaction.referenceId}
        type={transaction.referenceType}
      />

      <TransactionScreenGeneric.TransactionId id={transaction.id} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    gap: 18,
  },
});

export default TransactionDetailsTab;
