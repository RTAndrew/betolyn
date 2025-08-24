import { ThemedView } from '@/components/ThemedView';
import BetCard from '@/components/bet-card';
import { ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView>
      <ThemedView style={{ flex: 1 }}>
        {Array.from({ length: 20 }, (_, index) => (
          <BetCard key={index} />
        ))}
      </ThemedView>
    </ScrollView>
  );
}
