import React, { useMemo } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { useGetMyTransactionById } from '@/services';
import { TTransactionType } from '@/types';

import TransactionScreenGeneric from '../transaction-screen-generic';
import { formatTransactionDetail } from '../utils';
import TransactionDetailsTab from './transaction-detail-tab';
import TransactionItemsTab from './transaction-items-tab';

interface TransactionItemScreenProps {
  id: string;
}

const TRANSACTION_TYPES_TO_HIDE_TRANSACTION_ITEMS_TAB = [
  'TRANSFER',
  'MINT_CREDITS',
  'CHANNEL_FUNDING',
  'CHANNEL_WITHDRAW',
  'PLATFORM_FEE_COLLECTION',
  'MINT_CREDITS',
] as TTransactionType[];

const TransactionItemScreen = ({ id }: TransactionItemScreenProps) => {
  const { data, isPending, error } = useGetMyTransactionById({ id });
  const transaction = data?.data;

  const transactionDetail = useMemo(() => {
    if (!transaction) return null;

    return formatTransactionDetail(transaction?.type, transaction?.totalAmount ?? 0);
  }, [transaction]);

  const shouldHideTransactionItemsTab = Boolean(
    transaction?.type && TRANSACTION_TYPES_TO_HIDE_TRANSACTION_ITEMS_TAB.includes(transaction?.type)
  );

  return (
    <TransactionScreenGeneric
      isLoading={isPending}
      error={Boolean(error || !data)}
      header={{
        icon: transactionDetail?.icon,
        amount: transaction?.totalAmount ?? 0,
        tag: <ThemedText>{transactionDetail?.title}</ThemedText>,
      }}
      tabs={[
        {
          id: 'details',
          title: 'Details',
          content: <TransactionDetailsTab transaction={transaction!} />,
        },
        ...(shouldHideTransactionItemsTab
          ? []
          : [
              {
                id: 'overview',
                title: 'Transactions',
                content: <TransactionItemsTab items={transaction?.items ?? []} />,
              },
            ]),
      ]}
    />
  );
};

export default TransactionItemScreen;
