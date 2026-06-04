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

  if (
    type === 'MINT_CREDITS' ||
    type === 'OUTCOME_VOID' ||
    type === 'MARKET_VOID' ||
    type === 'MATCH_VOID'
  ) {
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

const TRANSACTION_TYPE_TITLES: Partial<Record<TTransactionType, string>> = {
  BET_PLACEMENT: 'Aposta',
  MATCH_SETTLEMENT: 'Liquidação',
  PLATFORM_FEE_COLLECTION: 'Taxa da plataforma',
  CHANNEL_WITHDRAW: 'Levantamento',
  CHANNEL_FUNDING: 'Financiamento do canal',
  MINT_CREDITS: 'Créditos emitidos',
  OUTCOME_VOID: 'Reembolso (Odd)',
  MARKET_VOID: 'Reembolso (Mercado)',
  MATCH_VOID: 'Reembolso (Evento)',
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

const TRANSACTION_ITEM_TYPE_TITLES: Partial<
  Record<TTransactionItemType | 'RESERVE_RELEASE', string>
> = {
  STAKE_ESCROW_LOCK: 'Montante retido',
  STAKE_ESCROW_REFUND: 'Montante reembolsado',
  LIABILITY_RESERVE: 'Reserva de risco',
  WIN_PAYOUT_STAKE: 'Montante retornado',
  WIN_PAYOUT_PROFIT: 'Pagamento do lucro',
  LOSS_COLLECTION: 'Cobrança da perda',
  RESERVE_RELEASE: 'Liberação do risco',
};

export const formatTransactionItemDetail = (
  transaction: ITransactionItem,
  context?: 'space' | 'user' | 'global'
): ITransactionDetail => {
  const formattedAmount = formatKwanzaAmount(transaction.amount);

  let title = TRANSACTION_ITEM_TYPE_TITLES[transaction.type] ?? null;
  let isFromViewerAccount = false;

  const SPACE_FROM_ACCOUNT_TYPE_NEGATE = ['SPACE_AVAILABLE', 'SPACE_RESERVED'] as TAccountType[];
  if (context === 'space' && SPACE_FROM_ACCOUNT_TYPE_NEGATE.includes(transaction.fromAccountType)) {
    isFromViewerAccount = true;
  } else if (context === 'user' && transaction.fromAccountType === 'USER_WALLET') {
    isFromViewerAccount = true;
  } else if (!title) {
    title = 'Do saldo';
  }

  return {
    title: title ?? '',
    icon: isFromViewerAccount ? ArrowUp : ArrowDown,
    amount: formattedAmount,
  };
};
