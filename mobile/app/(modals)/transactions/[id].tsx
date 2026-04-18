import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import TransactionItemScreen from '@/screens/me/transactions/[id]';

const TransactionItem = () => {
  const { id } = useLocalSearchParams();
  return <TransactionItemScreen id={id as string} />;
};

export default TransactionItem;
