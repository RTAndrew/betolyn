import { router } from 'expo-router';
import React from 'react';

import Tag from '@/components/tags';
import { colors } from '@/constants/colors';
import { useGetCriterionById, useGetMatch, useGetOddById } from '@/services';
import { IBetSlipItem, IBetSlipItemStatus } from '@/types';
import { useMultiQueryState } from '@/utils/react-query/use-multi-query-state';

import BetSlipCard from './bet-slip-card';
import { BetSlipItemCardSkeleton } from './skeleton';

const getStatusColor = (status: `${IBetSlipItemStatus}`) => {
  if (status === 'PENDING') return colors.complementary;
  if (status === 'WON') return colors.primary;
  if (status === 'LOST') return colors.secondary;
  return colors.greyLighter;
};

const BET_SLIP_ITEM_STATUS_LABELS: Partial<Record<IBetSlipItemStatus, string>> = {
  PENDING: 'Pending',
  WON: 'Won',
  LOST: 'Lost',
  VOIDED: 'Voided',
};

const getStatusLabel = (status: `${IBetSlipItemStatus}`) =>
  BET_SLIP_ITEM_STATUS_LABELS[status] ?? status;

export interface BetSlipItemCardProps {
  bet: IBetSlipItem;
}

const BetSlipItemCard = ({ bet }: BetSlipItemCardProps) => {
  const matchQuery = useGetMatch({
    matchId: bet.matchId,
  });

  const oddQuery = useGetOddById({
    oddId: bet.oddId,
  });

  const criterionQuery = useGetCriterionById({ criterionId: bet.criterionId });

  const { isInitialLoading: isPending } = useMultiQueryState([
    { query: matchQuery },
    { query: oddQuery },
    { query: criterionQuery },
  ]);

  if (isPending) {
    return <BetSlipItemCardSkeleton />;
  }

  const match = matchQuery.data?.data;
  const odd = oddQuery.data?.data;
  const criterion = criterionQuery.data?.data;

  const matchName =
    match?.homeTeam?.name && match?.awayTeam?.name
      ? `${match.homeTeam.name} vs ${match.awayTeam.name}`
      : (odd?.name ?? '-');

  const marketDescription = `${odd?.name} - ${criterion?.name}`;

  return (
    <BetSlipCard
      title={matchName}
      stake={bet.stake}
      description={marketDescription}
      isVoided={bet.status === 'VOIDED'}
      style={{ backgroundColor: '#414A5C' }}
      potentialPayout={bet.potentialPayout}
      oddValueAtPlacement={bet.oddValueAtPlacement}
      tags={<Tag title={getStatusLabel(bet.status)} color={getStatusColor(bet.status)} />}
      onPress={() =>
        router.push({ pathname: '/betslips/[id]', params: { id: bet.id, type: 'single' } })
      }
    />
  );
};

export default BetSlipItemCard;
