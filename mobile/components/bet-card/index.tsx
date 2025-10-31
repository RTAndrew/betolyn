import { router } from 'expo-router';
import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text as _Text,
  TextProps as _TextProps,
} from 'react-native';
import { OddButton } from '../odd-button';
import { IMatch } from '@/mock/matches';

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

      <Text style={{ color: '#C7D1E7' }}>{score}</Text>
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

export default function BetCard({ match, onPress }: BetCardProps) {
  const handlePress = () => {
    if (onPress) {
      onPress(match);
    } else {
      router.push(`/modal/match/${match.id}`);
    }
  };

  return (
    <TouchableOpacity activeOpacity={1} onPress={handlePress} style={styles.container}>
      <Text style={styles.cardTitle}>Futebol 100%</Text>

      <View style={styles.content}>
        <View style={styles.teamBody}>
          <View style={styles.teamWrapper}>
            <Team
              name={match.home_team}
              imageUrl={match.home_team_image_url}
              score={match.home_team_score}
            />
            <Team
              name={match.away_team}
              imageUrl={match.away_team_image_url}
              score={match.away_team_score}
            />
          </View>

          <View style={styles.betInfo}>
            <View style={styles.divider} />
            <Text style={{ color: '#C7D1E7' }}>100</Text>
          </View>
        </View>

        <View style={styles.oddsWrapper}>
          {match.main_criteria.odds.map((odd) => (
            <OddButton key={odd.id} odd={odd} />
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    color: 'white',
    paddingVertical: 10,
    borderBottomWidth: 0.3,
    borderBottomColor: '#C7D1E7',
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
    backgroundColor: '#C7D1E7',
  },
  oddsWrapper: {
    marginLeft: 50,
    flexDirection: 'column',
    gap: 10,
  },
  cardTitle: {
    color: '#C7D1E7',
    fontStyle: 'italic',
  },
});
