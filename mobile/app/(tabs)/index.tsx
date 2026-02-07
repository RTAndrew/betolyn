import { ThemedView } from '@/components/ThemedView';
import BetCard from '@/components/bet-card';
import { useGetMatches } from '@/services/matches/match-query';

import { ActivityIndicator, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeScreenHeader from '../../components/home-screen-header';

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
  const { data, isPending, error } = useGetMatches({});

  if (isPending) {
    return (
      <Wrapper>
        <ActivityIndicator size="large" color="#fff" />
      </Wrapper>
    );
  }

  if (!data) {
    console.log('No matches found', data, error);
    return (
      <Wrapper>
        <Text>No matches found</Text>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <HomeScreenHeader />
      {Object.values(data.data ?? []).map((match: any) => (
        <BetCard key={match.id} match={match} />
      ))}
    </Wrapper>
  );
}
