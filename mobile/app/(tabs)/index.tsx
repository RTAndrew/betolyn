import { ThemedView } from '@/components/ThemedView';
import BetCard from '@/components/bet-card';
import { mockAPI } from '@/mock';
import { useQuery } from '@/utils/http/use-query';
import { ScrollView, Text } from 'react-native';

export default function HomeScreen() {
  const matches = mockAPI.getMatches();
  return (
    <ScrollView style={{ flex: 1 }}>
      <ThemedView style={{ flex: 1 }}>
        {matches.map((match: any) => (
          <BetCard key={match.id} match={match} />
        ))}
      </ThemedView>
    </ScrollView>
  );
}
