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

  return (
    <BottomSheet onClose={closeAll} visible={visible}>
      <BottomSheet.Header>
        <BottomSheet.SafeHorizontalView style={{ width: '100%' }}>
          <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
            {getMatchStatusTag(match.status)}
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
                      'The markets and bets of the matches derived (usually from spaces) from this one will be canceled as well.',
                  },
                }),
              },
            });
          }}
        />

        <BottomSheet.ActionOption
          text="Update score"
          onPress={() => {
            pushSheet({ type: 'match-update-score' });
          }}
          icon={<SoccerBall color="white" />}
        />

        <BottomSheet.ActionOption text="Reschedule" icon={<TimeHistory color="white" />} />

        <BottomSheet.ActionOption
          text="Settle match"
          icon={<MoneyHand color="white" />}
          disabled={Boolean(match.settledAt)}
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
          disabled={match.status === 'ENDED'}
          text="Add market"
          onPress={() => {
            goBack();
            router.push(`/matches/${match.id}/create-criterion`);
          }}
          icon={<Add color="white" />}
        />
        <BottomSheet.ActionOption
          text="Suspend all markets"
          disabled={match.status === 'ENDED'}
          icon={<LockClosed color="white" />}
          onPress={() => {
            pushSheet({ type: 'match-suspend-all-markets' });
          }}
        />

        {match.type !== 'DERIVED' && (
          <BottomSheet.ActionOption
            text="End match"
            disabled={match.status === 'ENDED'}
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
