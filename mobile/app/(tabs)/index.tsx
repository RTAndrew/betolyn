import { ThemedView } from '@/components/ThemedView';
import BetCard from '@/components/bet-card';
import { useQuery } from '@/utils/http/use-query';
import { ActivityIndicator, ScrollView } from 'react-native';
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
  const { data, loading } = useQuery('/matches');

  if (loading) {
    return (
      <Wrapper>
        <ActivityIndicator size="large" color="#fff" />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {(data ?? []).map((match: any) => (
        <BetCard key={match.id} match={match} />
      ))}
    </Wrapper>
  );
}
