import React from 'react';
import { Image, Pressable, StyleSheet, View, ViewStyle } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { colors } from '@/constants/colors';
import { IMatch } from '@/types';

const Team = ({
  name,
  imageUrl,
  direction = 'row',
  showName = true,
}: {
  name: string;
  imageUrl: string;
  direction?: 'row' | 'row-reverse';
  showName?: boolean;
}) => {
  return (
    <View style={{ flexDirection: direction, alignItems: 'center', gap: 10 }}>
      <Image source={{ uri: imageUrl }} style={{ width: 36, height: 36 }} />
      {showName && (
        <ThemedText style={styles.teamName} className="team-name">
          {name}
        </ThemedText>
      )}
    </View>
  );
};

export interface MatchEventSmallCardProps {
  match: IMatch;
  onPress?: () => void;
  style?: ViewStyle;
  showName?: boolean;
}

export const MatchEventSmallCard = ({
  match,
  onPress,
  style,
  showName = true,
}: MatchEventSmallCardProps) => {
  const content = (
    <>
      <Team
        name={match.homeTeam.name}
        imageUrl={match.homeTeam.badgeUrl}
        direction="row-reverse"
        showName={showName}
      />
      <ThemedText style={styles.matchScore}>
        {match.homeTeamScore} : {match.awayTeamScore}
      </ThemedText>
      <Team
        name={match.awayTeam.name}
        imageUrl={match.awayTeam.badgeUrl}
        direction="row"
        showName={showName}
      />
    </>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={[styles.container, style]}>
        {content}
      </Pressable>
    );
  }

  return <View style={[styles.container, style]}>{content}</View>;
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: colors.greyDark,
  },
  teamName: {
    fontSize: 12,
    color: colors.greyLighter,
    fontWeight: '400',
  },
  matchScore: {
    fontSize: 12,
    color: colors.greyLighter,
    marginHorizontal: 10,
    fontWeight: '600',
  },
});
