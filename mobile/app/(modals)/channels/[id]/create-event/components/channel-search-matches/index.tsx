import BetCard from '@/components/bet-card';
import { ThemedView } from '@/components/ThemedView';
import { useGetMatches } from '@/services';
import { IMatch } from '@/types';
import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

interface ChannelSearchMatchesProps {
  onMatchPress?: (match: IMatch) => void;
}

const ChannelSearchMatches = ({ onMatchPress }: ChannelSearchMatchesProps) => {
  const { data, error, isPending } = useGetMatches({});
  const matches = data?.data;

  if (isPending) {
    return <Text>Loading...</Text>;
  }

  if (!matches || error) {
    return <Text>Error loading matches</Text>;
  }
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: '#61687E' }}>
        <ThemedView>
          <View style={{ marginBottom: 16 }}>
            <TextInput placeholder="Search" style={styles.input} placeholderTextColor="#BFBFBF" />
          </View>
        </ThemedView>

        <ThemedView style={{ flex: 1, backgroundColor: 'transparent' }}>
          {matches.map((match, index) => (
            <BetCard onPress={(m) => onMatchPress?.(m)} key={index} match={match} />
          ))}
        </ThemedView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#485164',
    borderRadius: 5,
    borderWidth: 1,
    color: 'white',
    borderColor: '#8791A5',
    padding: 10,
  },
  inputTitle: {
    color: 'white',
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
