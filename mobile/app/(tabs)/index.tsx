import { ThemedView } from '@/components/ThemedView';
import BetCard from '@/components/bet-card';
import { useGetMatches } from '@/services/matches/match-query';

import { router } from 'expo-router';
import { ActivityIndicator, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#61687E' }}>
      <ScrollView style={{ flex: 1 }}>
        <ThemedView style={{ flex: 1 }}>{children}</ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default function HomeScreen() {
  const { data, isPending } = useGetMatches({});

  if (isPending) {
    return (
      <Wrapper>
        <ActivityIndicator size="large" color="#fff" />
      </Wrapper>
    );
  }

  if (!data) {
    return (
      <Wrapper>
        <Text>No matches found</Text>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Text onPress={() => router.push('/auth/login')}> Sign In </Text>
      {(data.data ?? []).map((match: any) => (
        <BetCard key={match.id} match={match} />
      ))}
    </Wrapper>
  );
}
