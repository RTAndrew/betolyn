import { useSuspenseQuery } from '@tanstack/react-query';
import React, { Suspense, useMemo, useState } from 'react';

import BetCard from '@/components/bet-card';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import { Skeleton } from '@/components/skeleton';
import Tag from '@/components/tags';
import { colors } from '@/constants/colors';
import BetSlipItemCard from '@/screens/betslips/history/bet-slip-item-history';
import BetSlipCard from '@/screens/betslips/history/bet-slip-item-history/bet-slip-card';
import { getBetSlipQueryOptions, getMatchQueryOptions } from '@/services';
import { IBetSlipItemStatus, TTransactionReferenceType } from '@/types';
import { getBetSlipItemStatusTag } from '@/utils/get-entity-status-tag';

import TransactionScreenGeneric from '../transaction-screen-generic';

interface TransactionLinkedReferenceProps {
  reference: string;
  type: TTransactionReferenceType;
}

interface ReferenceProps {
  referenceId: string;
  onNotFound: () => void;
}

const MatchReference = ({ referenceId, onNotFound }: ReferenceProps) => {
  const { data } = useSuspenseQuery(getMatchQueryOptions({ matchId: referenceId }));
  const match = data.data;

  if (!match) {
    onNotFound();
    return <></>;
  }

  return (
    <SafeHorizontalView>
      <BetCard
        disableControls
        match={{
          ...match,
          mainCriterion: undefined,
        }}
      />
    </SafeHorizontalView>
  );
};

const BetSlipReference = ({ referenceId, onNotFound }: ReferenceProps) => {
  const { data } = useSuspenseQuery(getBetSlipQueryOptions({ betSlipId: referenceId }));
  const betSlip = data.data;

  const allBetsOnSameMatch = betSlip.items.every(
    (item) => item.matchId === betSlip.items[0].matchId
  );

  const name = useMemo(() => {
    if (allBetsOnSameMatch) {
      return `${betSlip.items[0].match?.homeTeam?.name} vs ${betSlip.items[0].match?.awayTeam?.name}`;
    }

    if (betSlip.type === 'PARLAY') {
      return 'Parlay';
    }

    return 'Single';
  }, [betSlip.items, allBetsOnSameMatch]);

  if (!betSlip) {
    onNotFound();
    return <></>;
  }

  if (betSlip.items.length === 1) {
    return <BetSlipItemCard bet={betSlip.items[0]} />;
  }

  return (
    // TODO: add support for BetSlips with multiple items or Parlays
    <BetSlipCard
      stake={betSlip.totalStake}
      title={name}
      style={{ backgroundColor: 'transparent' }}
      potentialPayout={betSlip.totalPotentialPayout}
      oddValueAtPlacement={betSlip.items.reduce((acc, item) => acc + item.oddValueAtPlacement, 0)}
      description={betSlip.items.map((item) => `${item.oddValueAtPlacement}`).join(', ')}
      tags={
        <>
          {getBetSlipItemStatusTag(betSlip.status as unknown as IBetSlipItemStatus)}
          {
            <Tag
              color={colors.greyLighter}
              textColor={colors.greyLighter50}
              title={`${betSlip.totalItemsCount} Outcomes`}
            />
          }
        </>
      }
    />
  );
};

const TransactionLinkedReference = ({ reference, type }: TransactionLinkedReferenceProps) => {
  const [referenceNotFound, setReferenceNotFound] = useState(false);

  if (!['MATCH', 'BET_SLIP'].includes(type)) return <></>;

  if (referenceNotFound) {
    return <></>;
  }

  return (
    <TransactionScreenGeneric.LinkedReference>
      <Suspense fallback={<Skeleton size={'100%'} borderRadius={12} />}>
        {type === 'MATCH' && (
          <MatchReference referenceId={reference} onNotFound={() => setReferenceNotFound(true)} />
        )}
        {type === 'BET_SLIP' && (
          <BetSlipReference referenceId={reference} onNotFound={() => setReferenceNotFound(true)} />
        )}
      </Suspense>
    </TransactionScreenGeneric.LinkedReference>
  );
};

export default TransactionLinkedReference;
