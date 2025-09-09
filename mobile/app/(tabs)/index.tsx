import { ThemedView } from '@/components/ThemedView';
import BetCard from '@/components/bet-card';
import { useQuery } from '@/utils/http/use-query';
import { ScrollView, Text } from 'react-native';

export default function HomeScreen() {
  const { loading, error, data } = useQuery('/matches');

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <ThemedView style={{ flex: 1 }}>
        {data.matches.map((match: any) => (
          <BetCard key={match.id} match={match} />
        ))}
      </ThemedView>
    </ScrollView>
  );
}
