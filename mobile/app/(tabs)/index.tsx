import { ThemedView } from '@/components/ThemedView';
import BetCard from '@/components/bet-card';
import { mockAPI } from '@/mock';
import { getRequest } from '@/utils/http';
import { useQuery } from '@/utils/http/use-query';
import { ActivityIndicator, ScrollView, Text } from 'react-native';

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <ScrollView style={{ flex: 1 }}>
      <ThemedView style={{ flex: 1 }}>{children}</ThemedView>
    </ScrollView>
  );
};

export default function HomeScreen() {
  const { data, loading, error } = useQuery('/matches');

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
