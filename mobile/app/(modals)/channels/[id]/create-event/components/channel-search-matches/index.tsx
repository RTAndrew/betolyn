import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import BetCard from '@/components/bet-card';
import ScreenWrapper from '@/components/screen-wrapper';
import { Skeleton } from '@/components/skeleton';
import { MatchCardSkeleton } from '@/components/skeleton/match-card-skeleton';
import { colors } from '@/constants/colors';
import { useGetMatches } from '@/services';
import { IMatch } from '@/types';

interface ChannelSearchMatchesProps {
  onMatchPress?: (match: IMatch) => void;
}

const ChannelSearchMatches = ({ onMatchPress }: ChannelSearchMatchesProps) => {
  const { data, error, isPending } = useGetMatches({});
  const matches = data?.data;

  if (isPending) {
    return (
      <ScreenWrapper backgroundColor={colors.greyLight} scrollable={true} safeArea={false}>
        <View style={{ marginBottom: 16 }}>
          <TextInput placeholder="Search" style={styles.input} placeholderTextColor="#BFBFBF" />
        </View>
        <View style={{ flex: 1 }}>
          <Skeleton.Group count={5} gap={0}>
            <MatchCardSkeleton />
          </Skeleton.Group>
        </View>
      </ScreenWrapper>
    );
  }

  if (!matches || error) {
    return <Text>Error loading matches</Text>;
  }
  return (
    <ScreenWrapper backgroundColor={colors.greyLight} scrollable={true} safeArea={false}>
      <View style={{ marginBottom: 16 }}>
        <TextInput placeholder="Search" style={styles.input} placeholderTextColor="#BFBFBF" />
      </View>
      <View style={{ flex: 1 }}>
        {matches.map((match, index) => (
          <BetCard onPress={(m) => onMatchPress?.(m)} key={index} match={match} />
        ))}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.greyMedium,
    borderRadius: 5,
    borderWidth: 1,
    color: colors.white,
    borderColor: '#8791A5',
    padding: 10,
  },
  inputTitle: {
    color: colors.white,
    marginBottom: 5,
  },
  inputIcon: {
    position: 'absolute',
    left: 15,
    top: '50%',
    transform: [{ translateY: -10 }],
    zIndex: 1,
  },
});

export default ChannelSearchMatches;
