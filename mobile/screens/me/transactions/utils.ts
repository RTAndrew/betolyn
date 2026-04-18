import React from 'react';
import { SvgProps } from 'react-native-svg';

import { ArrowDown, ArrowUp, MoneyHand, Trophy } from '@/components/icons';
import { ITransactionItem, TAccountType, TTransactionItemType, TTransactionType } from '@/types';
import { formatKwanzaAmount } from '@/utils/number-formatters';

export function getTransactionIcon(
  type: TTransactionType | TTransactionItemType
): React.ComponentType<SvgProps> {
  if (type === 'MATCH_SETTLEMENT') {
    return Trophy;
  }

  if (type === 'CHANNEL_FUNDING') {
    return ArrowUp;
  }

  if (type === 'MINT_CREDITS') {
    return ArrowDown;
  }

  return MoneyHand;
}

interface ITransactionDetail {
  title: string;
  description?: string;
  amount: number | string;
  icon: React.ComponentType<SvgProps>;
}

const negateAmount = (amount: string) => `-${amount}`;

const TRANSACTION_TYPE_TITLES: Partial<Record<TTransactionType, string>> = {
  BET_PLACEMENT: 'Bet Placed',
  MATCH_SETTLEMENT: 'Settlement',
  MATCH_VOID: 'Cashback',
  PLATFORM_FEE_COLLECTION: 'Platform Fee',
  CHANNEL_WITHDRAW: 'Withdraw',
  CHANNEL_FUNDING: 'Space Funding',
  MINT_CREDITS: 'Mint Credits',
};

export const formatTransactionDetail = (
  type: TTransactionType,
  totalAmount: number
): ITransactionDetail => {
  const formattedTotalAmount = formatKwanzaAmount(totalAmount);
  const icon = getTransactionIcon(type);

  const title = TRANSACTION_TYPE_TITLES[type] ?? '';
  let amount: number | string = formattedTotalAmount;

  return { title, icon, amount };
};

const TRANSACTION_ITEM_TYPE_TITLES: Partial<Record<TTransactionItemType, string>> = {
  STAKE_ESCROW: 'Stake Escrow',
  LIABILITY_RESERVE: 'Liability Reserve',
  WIN_PAYOUT_STAKE: 'Stake Return',
  WIN_PAYOUT_PROFIT: 'Profit Payout',
  LOSS_COLLECTION: 'Loss Collection',
  RESERVE_RELEASE: 'Reserve Release',
};

export const formatTransactionItemDetail = (
  transaction: ITransactionItem,
  context?: 'space' | 'user' | 'global'
): ITransactionDetail => {
  const formattedAmount = formatKwanzaAmount(transaction.amount);

  let title = TRANSACTION_ITEM_TYPE_TITLES[transaction.type] ?? null;
  let shouldNegateAmount = false;

  const SPACE_FROM_ACCOUNT_TYPE_NEGATE = ['SPACE_AVAILABLE', 'SPACE_RESERVED'] as TAccountType[];
  if (context === 'space' && SPACE_FROM_ACCOUNT_TYPE_NEGATE.includes(transaction.fromAccountType)) {
    shouldNegateAmount = true;
  } else if (context === 'user' && transaction.fromAccountType === 'USER_WALLET') {
    title = 'From balance';
    shouldNegateAmount = true;
  }

  return {
    title: title ?? '',
    icon: shouldNegateAmount ? ArrowUp : ArrowDown,
    amount: shouldNegateAmount ? negateAmount(formattedAmount) : formattedAmount,
  };
};
