import { router } from 'expo-router';
import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

import BottomSheet from '@/components/bottom-sheet';
import { useSettleMatch } from '@/services/matches/match-mutation';
import { useGetMatchCriteria } from '@/services/matches/match-query';
import { MatchStatusEnum, CriterionStatusEnum } from '@/types';
import { ApiError } from '@/utils/http/api-error';

import { useMatchBottomSheet } from '../context';
import { ISheet } from '../index';

const MESSAGE_NOT_ENDED =
  'Match must be ended before you can settle. End the match first, then settle.';
const MESSAGE_NOT_ENDED_DERIVED =
  'Match must be ended before you can settle. This event follows the official fixture; when that match ends, this event will show as ended, then you can settle.';
const MESSAGE_CRITERIA_NOT_READY =
  'Market is stil active or has not a winner yet. Suspend the market and set a winner before settling.';

const formatSettleSummary = (
  criteria: { totalBetsCount?: number; reservedLiability?: number }[]
): string => {
  const totalBets = criteria.reduce((sum, c) => sum + (c.totalBetsCount ?? 0), 0);
  const totalPayout = criteria.reduce((sum, c) => sum + (c.reservedLiability ?? 0), 0);
  if (totalBets <= 0 && totalPayout <= 0) {
    return 'This will settle all markets and pay out winning bets. Confirm?';
  }
  const betLabel = totalBets === 1 ? '1 bet' : `${Math.round(totalBets)} bets`;
  const amount = totalPayout.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
  return `This will process ${betLabel} (${amount}). Confirm?`;
};

export const SettleMatchSheet = ({ visible = false }: ISheet) => {
  const { closeAll, closeMatchScreen, match } = useMatchBottomSheet();
  const { data: criteriaResult, isPending: criteriaLoading } = useGetMatchCriteria({
    matchId: match.id,
    queryOptions: {
      enabled: visible && match.status === MatchStatusEnum.ENDED,
      refetchOnMount: true,
    },
  });
  const settleMatch = useSettleMatch();

  const criteria = criteriaResult?.data ?? [];
  const allSuspended =
    criteria.length > 0 && criteria.every((c) => c.status === CriterionStatusEnum.SUSPENDED);
  const allHaveWinner =
    criteria.length > 0 && criteria.every((c) => c.odds?.some((o) => o.isWinner) ?? false);
  const isReadyToSettle = allSuspended || allHaveWinner;

  const handleSeeCriteria = () => {
    closeMatchScreen();
    router.push(`/matches/${match.id}/settings`);
  };

  const handleConfirmSettle = async () => {
    await settleMatch.mutateAsync(match.id);
    // On success, ModalConfirmation calls onClose (closeAll). On failure we throw and sheet stays open.
  };

  if (!visible) return null;

  if (match.settledAt) {
    return (
      <BottomSheet.ModalConfirmation
        title="Settle match"
        visible={visible}
        onClose={closeAll}
        description="This match is already settled."
        onCancelText="Close"
      />
    );
  }

  if (match.status !== MatchStatusEnum.ENDED) {
    return (
      <BottomSheet.ModalConfirmation
        title="Settle match"
        visible={visible}
        onClose={closeAll}
        description={match.type === 'DERIVED' ? MESSAGE_NOT_ENDED_DERIVED : MESSAGE_NOT_ENDED}
        onCancelText="Close"
      />
    );
  }

  if (criteriaLoading) {
    return (
      <BottomSheet.ModalConfirmation
        title="Settle match"
        visible={visible}
        onClose={closeAll}
        description="Loading..."
        onCancelText="Close"
      >
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="white" />
        </View>
      </BottomSheet.ModalConfirmation>
    );
  }

  if (!isReadyToSettle) {
    return (
      <BottomSheet.ModalConfirmation
        title="Settle match"
        visible={visible}
        onClose={closeAll}
        description={MESSAGE_CRITERIA_NOT_READY}
        onConfirm={handleSeeCriteria}
        onConfirmText="See criteria"
        onCancelText="Close"
      />
    );
  }

  const settleSummary = formatSettleSummary(criteria);

  const isSettling = settleMatch.isPending;
  const settleError = settleMatch.error;

  return (
    <BottomSheet.ModalConfirmation
      title="Settle match"
      visible={visible}
      onClose={closeAll}
      description={
        settleError
          ? ApiError.isApiError(settleError)
            ? settleError.message
            : ((settleError as Error)?.message ?? 'Settlement failed. Try again or close.')
          : settleSummary
      }
      onConfirm={handleConfirmSettle}
      onConfirmText={isSettling ? 'Settling…' : 'Confirm'}
      onCancelText="Cancel"
    />
  );
};

const styles = StyleSheet.create({
  loading: {
    paddingVertical: 24,
    alignItems: 'center',
  },
});
