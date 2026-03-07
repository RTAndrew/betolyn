import { router } from 'expo-router';
import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text as _Text,
  TextProps as _TextProps,
} from 'react-native';

import { MatchBottomSheetProvider, useMatchBottomSheet } from '@/components/match/bottom-sheet';
import { colors } from '@/constants/colors';
import { IMatch } from '@/types';

import { OddButton } from '../odd-button';

const Text = ({ children, style, ...props }: _TextProps) => {
  return (
    <_Text style={[{ color: 'white' }, style]} {...props}>
      {children}
    </_Text>
  );
};

interface TeamProps {
  name: string;
  imageUrl: string;
  score: number;
}

const Team = ({ name, imageUrl, score }: TeamProps) => {
  return (
    <View style={teamStyles.teamContent}>
      <View style={teamStyles.teamInfo}>
        <Image source={{ uri: imageUrl }} style={{ width: 30, height: 30 }} />
        <Text className="team-name">{name}</Text>
      </View>

      <Text style={{ color: colors.greyLighter }}>{score}</Text>
    </View>
  );
};

const teamStyles = StyleSheet.create({
  teamContent: {
    gap: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});

interface BetCardProps {
  match: IMatch;
  onPress?: (match: IMatch) => void;
}

const BetCard = (props: BetCardProps) => {
  return (
    <MatchBottomSheetProvider match={props.match}>
      {<BetCardChild {...props} />}
    </MatchBottomSheetProvider>
  );
};

const BetCardChild = ({ match, onPress }: BetCardProps) => {
  const { pushSheet } = useMatchBottomSheet();

  const handlePress = () => {
    if (onPress) {
      onPress(match);
    } else {
      router.push(`/matches/${match.id}`);
    }
  };

  return (
    <>
      <TouchableWithoutFeedback
        delayLongPress={200}
        onPress={handlePress}
        style={styles.container}
        onLongPress={() => pushSheet({ type: 'match-action' })}
      >
        <View style={styles.content}>
          <View style={styles.teamBody}>
            <View style={styles.teamWrapper}>
              <Team
                name={match.homeTeam.name}
                imageUrl={match.homeTeam.badgeUrl}
                score={match.homeTeamScore}
              />
              <Team
                name={match.awayTeam.name}
                imageUrl={match.awayTeam.badgeUrl}
                score={match.awayTeamScore}
              />
            </View>

            <View style={styles.betInfo}>
              <View style={styles.divider} />
              <Text style={{ color: colors.greyLighter }}>100</Text>
            </View>
          </View>

          <View style={styles.oddsWrapper}>
            {(match.mainCriterion?.odds ?? []).map((odd) => (
              <OddButton showName={false} key={odd.id} odd={odd} criterion={match.mainCriterion!} />
            ))}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
};
export default BetCard;

const styles = StyleSheet.create({
  container: {
    color: colors.white,
    paddingVertical: 10,
    borderBottomWidth: 0.3,
    borderBottomColor: colors.greyLighter,
    flexDirection: 'column',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  teamWrapper: {
    flexDirection: 'column',
    flex: 1,
    gap: 15,
  },
  betInfo: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    width: 0.3,
    marginHorizontal: 10,
    height: '90%',
    backgroundColor: colors.greyLighter,
  },
  oddsWrapper: {
    marginLeft: 50,
    flexDirection: 'column',
    gap: 10,
  },
});
