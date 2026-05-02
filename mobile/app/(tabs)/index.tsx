import { FlatList, Platform, View } from 'react-native';

import BetCard from '@/components/bet-card';
import EmptyState from '@/components/empty-state';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import ScreenHeader from '@/components/screen-header';
import ScreenWrapper from '@/components/screen-wrapper';
import { Spinner } from '@/components/spinner';
import { colors } from '@/constants/colors';
import { useGetMatches } from '@/services/matches/match-query';

import HomeScreenHeader from '../../components/home-screen-header';

export default function HomeScreen() {
  const { data, isPending, error } = useGetMatches({});

  if (isPending) {
    return (
      <ScreenWrapper backgroundColor={colors.greyLight} safeArea={false}>
        <ScreenHeader safeArea>
          <HomeScreenHeader />
        </ScreenHeader>

        <Spinner fullScreen size="large" color={colors.white} />
      </ScreenWrapper>
    );
  }

  if (error || !data) {
    return (
      <ScreenWrapper backgroundColor={colors.greyLight}>
        <EmptyState.NoSearch center title="No matches found" description="Please try again later" />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scrollable={false} backgroundColor={colors.greyLight} safeArea={false}>
      <ScreenHeader>
        <HomeScreenHeader />
      </ScreenHeader>

      <View style={{ paddingBottom: 120 }}>
        <FlatList
          keyExtractor={(item) => item.id}
          data={Object.values(data.data ?? [])}
          contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 240 : 120 }}
          renderItem={({ item }) => (
            <SafeHorizontalView>
              <BetCard match={item} />
            </SafeHorizontalView>
          )}
        />
      </View>
    </ScreenWrapper>
  );
}
