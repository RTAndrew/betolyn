import React from 'react';
import BottomSheet from '@/components/bottom-sheet';
import { Image, StyleSheet, Text, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Close, SoccerBall, TimeHistory, TrendingLines } from '@/components/icons';
import { useBetCardBottomSheet } from '../context';
import { ISheet } from '.';

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
  const { match, pushSheet, closeAll } = useBetCardBottomSheet();

  return (
    <BottomSheet onClose={closeAll} visible={visible}>
      <BottomSheet.Header>
        <BottomSheet.SafeHorizontalView style={{ width: '100%' }}>
          <View style={styles.teamWrapper}>
            <Team name={'Home'} imageUrl={match.homeTeam.badgeUrl} direction="row-reverse" />
            <ThemedText style={{ color: '#C7D1E7', fontWeight: '900' }}> 0 : 0 </ThemedText>
            <Team name={'Away'} imageUrl={match.awayTeam.badgeUrl} direction="row" />
          </View>
        </BottomSheet.SafeHorizontalView>
      </BottomSheet.Header>

      <View style={{ flexDirection: 'column', gap: 24 }}>
        <BottomSheet.ActionOption
          text="Update Score"
          onPress={() => {
            pushSheet('update-score');
          }}
          icon={<SoccerBall width={28} height={28} color="white" />}
        />
        <BottomSheet.ActionOption
          text="Reschedule"
          icon={<TimeHistory width={28} height={28} color="white" />}
        />
        <BottomSheet.ActionOption
          text="Update Criteria"
          icon={<TrendingLines width={28} height={28} color="white" />}
        />
        <BottomSheet.ActionOption
          text="End Match"
          icon={<Close width={28} height={28} color="white" />}
          onPress={() => {
            pushSheet('end-match');
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
