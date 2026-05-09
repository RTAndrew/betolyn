import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import BottomSheet from '@/components/bottom-sheet';
import { useSettleMatch } from '@/services/matches/match-mutation';
import { useGetMatchCriteria } from '@/services/matches/match-query';
import { CriterionStatusEnum, MatchStatusEnum } from '@/types';
import { ApiError } from '@/utils/http/api-error';
import { formatKwanzaAmount } from '@/utils/number-formatters';

import { useMatchBottomSheet } from '../context';
import { ISheet } from '../index';

const MESSAGE_NOT_ENDED =
  'O evento tem de estar terminado antes de anunciar vencedores. Termine o evento primeiro.';
const MESSAGE_NOT_ENDED_DERIVED =
  'O evento tem de estar terminado antes de anunciar vencedores. Este evento segue o oficial; quando terminar, poderá anunciar vencedores.';
const MESSAGE_CRITERIA_NOT_READY =
  'O mercado ainda está ativo ou sem vencedor. Suspenda o mercado e defina um vencedor antes de anunciar.';

const formatSettleSummary = (
  criteria: { totalBetsCount?: number; reservedLiability?: number }[]
): string => {
  const totalBets = criteria.reduce((sum, c) => sum + (c.totalBetsCount ?? 0), 0);
  const totalPayout = criteria.reduce((sum, c) => sum + (c.reservedLiability ?? 0), 0);
  if (totalBets <= 0 && totalPayout <= 0) {
    return 'Isto vai anunciar vencedores em todos os mercados e pagar apostas vencedoras. Confirmar?';
  }
  const betLabel = totalBets === 1 ? '1 aposta' : `${Math.round(totalBets)} apostas`;

  return `Isto vai processar ${betLabel} (${formatKwanzaAmount(totalPayout)}). Confirmar?`;
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

  const handleSeeCriteria = async () => {
    await closeMatchScreen();
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
        title="Anunciar vencedores"
        visible={visible}
        onClose={closeAll}
        description="Este evento já foi anunciado."
        onCancelText="Fechar"
      />
    );
  }

  if (match.status !== MatchStatusEnum.ENDED) {
    return (
      <BottomSheet.ModalConfirmation
        title="Anunciar vencedores"
        visible={visible}
        onClose={closeAll}
        description={match.type === 'DERIVED' ? MESSAGE_NOT_ENDED_DERIVED : MESSAGE_NOT_ENDED}
        onCancelText="Fechar"
      />
    );
  }

  if (criteriaLoading) {
    return (
      <BottomSheet.ModalConfirmation
        title="Anunciar vencedores"
        visible={visible}
        onClose={closeAll}
        description="A carregar..."
        onCancelText="Fechar"
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
        title="Anunciar vencedores"
        visible={visible}
        onClose={closeAll}
        description={MESSAGE_CRITERIA_NOT_READY}
        onConfirm={handleSeeCriteria}
        onConfirmText="Ver mercados"
        onCancelText="Fechar"
      />
    );
  }

  const settleSummary = formatSettleSummary(criteria);

  const isSettling = settleMatch.isPending;
  const settleError = settleMatch.error;

  return (
    <BottomSheet.ModalConfirmation
      title="Anunciar vencedores"
      visible={visible}
      onClose={closeAll}
      description={
        settleError
          ? ApiError.isApiError(settleError)
            ? settleError.message
            : ((settleError as Error)?.message ??
              'Falha ao anunciar vencedores. Tente novamente ou feche.')
          : settleSummary
      }
      onConfirm={handleConfirmSettle}
      onConfirmText={isSettling ? 'A anunciar...' : 'Confirmar'}
      onCancelText="Cancelar"
    />
  );
};

const styles = StyleSheet.create({
  loading: {
    paddingVertical: 24,
    alignItems: 'center',
  },
});
