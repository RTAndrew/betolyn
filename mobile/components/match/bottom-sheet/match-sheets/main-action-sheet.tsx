import React from 'react';
import BottomSheet from '@/components/bottom-sheet';
import { Image, StyleSheet, Text, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Add, Close, SoccerBall, TimeHistory, TrendingLines } from '@/components/icons';
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
  const { match, pushSheet, closeAll } = useMatchBottomSheet();

  return (
    <BottomSheet onClose={closeAll} visible={visible}>
      <BottomSheet.Header>
        <BottomSheet.SafeHorizontalView style={{ width: '100%' }}>
          <View style={styles.teamWrapper}>
            <Team name={'Home'} imageUrl={match.homeTeam.badgeUrl} direction="row-reverse" />
            <ThemedText style={{ color: '#C7D1E7', fontWeight: '900' }}> {match.homeTeamScore} : {match.awayTeamScore} </ThemedText>
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
          icon={<SoccerBall width={28} height={28} color="white" />}
        />
        <BottomSheet.ActionOption
          text="Reschedule"
          icon={<TimeHistory width={28} height={28} color="white" />}
        />
        <BottomSheet.ActionOption
          text="View all markets"
          icon={<TrendingLines width={28} height={28} color="white" />}
        />
        <BottomSheet.ActionOption
          text="Add market"
          onPress={() => {
            closeAll();
            router.push(`/matches/${match.id}/create-criterion`);
          }}
          icon={<Add width={28} height={28} color="white" />}
        />
        <BottomSheet.ActionOption
          text="End match"
          icon={<Close width={28} height={28} color="white" />}
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
    color: '#C7D1E7',
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
