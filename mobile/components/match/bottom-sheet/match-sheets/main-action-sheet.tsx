import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import BottomSheet from '@/components/bottom-sheet';
import {
  Add,
  LockClosed,
  MoneyHand,
  Settings,
  SoccerBall,
  TimeHistory,
  TimerOff,
  Trash,
} from '@/components/icons';
import { ThemedText } from '@/components/ThemedText';
import { colors } from '@/constants/colors';
import { MatchStatusEnum } from '@/types';
import { getMatchStatusTag } from '@/utils/get-entity-status-tag';

import { useMatchBottomSheet } from '../context';
import { ISheet } from '../index';

const Team = ({
  name,
  imageUrl,
  direction = 'row',
}: {
  name: string;
  imageUrl: string;
  direction?: 'row' | 'row-reverse';
}) => {
  return (
    <View style={{ flexDirection: direction, alignItems: 'center', gap: 10 }}>
      <Image source={{ uri: imageUrl }} style={{ width: 30, height: 30 }} />
      <Text style={styles.teamName} className="team-name">
        {name}
      </Text>
    </View>
  );
};

export const MainActionSheet = ({ visible = false }: ISheet) => {
  const { match, pushSheet, closeAll, closeMatchScreen } = useMatchBottomSheet();

  const isDerivedMatch = match.type === 'DERIVED';
  const hasEnded =
    match.status === MatchStatusEnum.CANCELLED ||
    match.status === MatchStatusEnum.ENDED ||
    Boolean(match.settledAt);

  const canSettle = () => {
    if (match.settledAt) return false;

    if (![MatchStatusEnum.ENDED].includes(match.status as MatchStatusEnum)) return false;

    return true;
  };

  const canUpdateScore = () => {
    if (isDerivedMatch) return false;
    if (hasEnded) return false;
    return true;
  };

  const canEndMatch = () => {
    if (isDerivedMatch) return false;
    if (hasEnded) return false;
    return true;
  };

  const canSuspendAllMarkets = () => {
    if (isDerivedMatch) return false;
    if (hasEnded) return false;
    return true;
  };

  return (
    <BottomSheet onClose={closeAll} visible={visible}>
      <BottomSheet.Header>
        <BottomSheet.SafeHorizontalView style={{ width: '100%' }}>
          <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
            {getMatchStatusTag(match.status, Boolean(match.settledAt))}
          </View>
          <View style={styles.teamWrapper}>
            <Team name={'Casa'} imageUrl={match.homeTeam.badgeUrl} direction="row-reverse" />
            <ThemedText style={{ color: colors.greyLighter, fontWeight: '900' }}>
              {match.homeTeamScore} : {match.awayTeamScore}
            </ThemedText>
            <Team name={'Fora'} imageUrl={match.awayTeam.badgeUrl} direction="row" />
          </View>
        </BottomSheet.SafeHorizontalView>
      </BottomSheet.Header>

      <View style={{ flexDirection: 'column', gap: 24 }}>
        <BottomSheet.ActionOption
          disabled={isDerivedMatch || Boolean(match.settledAt)}
          text="Cancelar e reembolsar"
          icon={<Trash color="white" />}
          onPress={() => {
            pushSheet({
              type: 'cancel-and-refund',
              data: {
                id: match.id,
                type: 'match',
                name: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
                ...(match.type === 'OFFICIAL' && {
                  note: {
                    title: 'Isto também afeta eventos vinculados.',
                    description:
                      'Eventos de espacos derivados deste serão anulados e cancelados (mercados e odds).',
                  },
                }),
              },
            });
          }}
        />

        <BottomSheet.ActionOption
          text="Atualizar resultado"
          disabled={!canUpdateScore()}
          onPress={() => {
            pushSheet({ type: 'match-update-score' });
          }}
          icon={<SoccerBall color="white" />}
        />

        <BottomSheet.ActionOption disabled text="Reagendar" icon={<TimeHistory color="white" />} />

        <BottomSheet.ActionOption
          text="Anunciar vencedores"
          icon={<MoneyHand color="white" />}
          disabled={!canSettle()}
          onPress={() => {
            pushSheet({ type: 'match-settle-match' });
          }}
        />

        <BottomSheet.ActionOption
          text="Definições"
          onPress={async () => {
            await closeMatchScreen();
            router.push(`/matches/${match.id}/settings`);
          }}
          icon={<Settings color="white" />}
        />
        <BottomSheet.ActionOption
          disabled={hasEnded}
          text="Adicionar mercado"
          onPress={async () => {
            await closeMatchScreen();
            router.push(`/matches/${match.id}/create-criterion`);
          }}
          icon={<Add color="white" />}
        />

        <BottomSheet.ActionOption
          disabled={!canSuspendAllMarkets()}
          text="Suspender todos os mercados"
          icon={<LockClosed color="white" />}
          onPress={() => {
            pushSheet({ type: 'match-suspend-all-markets' });
          }}
        />

        {canEndMatch() && (
          <BottomSheet.ActionOption
            text="Terminar evento"
            icon={<TimerOff color="white" />}
            onPress={() => {
              pushSheet({ type: 'match-end-match' });
            }}
          />
        )}
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  teamName: {
    color: colors.greyLighter,
    fontSize: 12,
  },
  teamWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    gap: 20,
  },
});
