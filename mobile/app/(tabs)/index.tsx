import { ThemedView } from '@/components/ThemedView';
import BetCard from '@/components/bet-card';
import { useGetMatches } from '@/services/matches/match-query';

import { router } from 'expo-router';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';

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

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('authToken');
    await SecureStore.deleteItemAsync('authUser');
  };

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
      <View style={{ paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text onPress={() => router.push('/auth/login')}> Sign In </Text>
        <Text onPress={() => handleLogout()}> Logout </Text>
      </View>
      {Object.values(data.data ?? []).map((match: any) => (
        <BetCard key={match.id} match={match} />
      ))}
    </Wrapper>
  );
}
