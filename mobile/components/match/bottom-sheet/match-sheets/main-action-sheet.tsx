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
  const { match, pushSheet, closeAll, goBack } = useMatchBottomSheet();

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
            <Team name={'Home'} imageUrl={match.homeTeam.badgeUrl} direction="row-reverse" />
            <ThemedText style={{ color: colors.greyLighter, fontWeight: '900' }}>
              {match.homeTeamScore} : {match.awayTeamScore}
            </ThemedText>
            <Team name={'Away'} imageUrl={match.awayTeam.badgeUrl} direction="row" />
          </View>
        </BottomSheet.SafeHorizontalView>
      </BottomSheet.Header>

      <View style={{ flexDirection: 'column', gap: 24 }}>
        <BottomSheet.ActionOption
          disabled={isDerivedMatch || Boolean(match.settledAt)}
          text="Cancel & Refund"
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
                    title: 'This will also affect linked matches.',
                    description:
                      'Space-linked events derived from this will be voided and canceled the as well (markets and outcomes).',
                  },
                }),
              },
            });
          }}
        />

        <BottomSheet.ActionOption
          text="Update score"
          disabled={!canUpdateScore()}
          onPress={() => {
            pushSheet({ type: 'match-update-score' });
          }}
          icon={<SoccerBall color="white" />}
        />

        <BottomSheet.ActionOption disabled text="Reschedule" icon={<TimeHistory color="white" />} />

        <BottomSheet.ActionOption
          text="Settle match"
          icon={<MoneyHand color="white" />}
          disabled={!canSettle()}
          onPress={() => {
            pushSheet({ type: 'match-settle-match' });
          }}
        />

        <BottomSheet.ActionOption
          text="Settings"
          onPress={() => {
            goBack();
            router.push(`/matches/${match.id}/settings`);
          }}
          icon={<Settings color="white" />}
        />
        <BottomSheet.ActionOption
          disabled={hasEnded}
          text="Add market"
          onPress={() => {
            goBack();
            router.push(`/matches/${match.id}/create-criterion`);
          }}
          icon={<Add color="white" />}
        />

        <BottomSheet.ActionOption
          disabled={!canSuspendAllMarkets()}
          text="Suspend all markets"
          icon={<LockClosed color="white" />}
          onPress={() => {
            pushSheet({ type: 'match-suspend-all-markets' });
          }}
        />

        {canEndMatch() && (
          <BottomSheet.ActionOption
            text="End match"
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
