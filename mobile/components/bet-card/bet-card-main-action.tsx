import React from 'react';
import BottomSheet from '../bottom-sheet';
import SafeHorizontalView from '../safe-horizontal-view';
import { Image, StyleSheet, Text, View } from 'react-native';
import { IMatch } from '@/types';
import { ThemedText } from '../ThemedText';
import { Close, Ellipsis, SoccerBall, TimeHistory, TrendingLines } from '../icons';

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
    <View style={{ flexDirection: direction, alignItems: 'center', gap: 5 }}>
      <Image source={{ uri: imageUrl }} style={{ width: 30, height: 30 }} />
      <Text style={styles.teamName} className="team-name">
        {name}
      </Text>
    </View>
  );
};

interface BetCardMainActionProps {
  match: IMatch;
  onClose: () => void;
  visible?: boolean;
}

export const BetCardMainAction = ({ match, onClose, visible = false }: BetCardMainActionProps) => {
  return (
    <BottomSheet onClose={() => onClose()} visible={visible}>
      <>
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
          />
        </View>
      </>
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
