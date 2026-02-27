import React from 'react';
import BottomSheet from '@/components/bottom-sheet';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';
import { ThemedText } from '@/components/ThemedText';
import {
  Add,
  SoccerBall,
  TimeHistory,
  TrendingLines,
  TimerOff,
  Settings,
} from '@/components/icons';
import { useMatchBottomSheet } from '../context';
import { ISheet } from '../index';
import { router } from 'expo-router';

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
          text="Update score"
          onPress={() => {
            pushSheet({ type: 'match-update-score' });
          }}
          icon={<SoccerBall color="white" />}
        />
        <BottomSheet.ActionOption text="Reschedule" icon={<TimeHistory color="white" />} />
        <BottomSheet.ActionOption text="View all markets" icon={<TrendingLines color="white" />} />
        <BottomSheet.ActionOption
          text="Settings"
          onPress={() => {
            goBack();
            router.push(`/matches/${match.id}/settings`);
          }}
          icon={<Settings color="white" />}
        />
        <BottomSheet.ActionOption
          text="Add market"
          onPress={() => {
            goBack();
            router.push(`/matches/${match.id}/create-criterion`);
          }}
          icon={<Add color="white" />}
        />
        <BottomSheet.ActionOption
          text="End match"
          icon={<TimerOff color="white" />}
          onPress={() => {
            pushSheet({ type: 'match-end-match' });
          }}
        />
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
