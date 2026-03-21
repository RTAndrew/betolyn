import { ScrollView, Text, View } from 'react-native';

import BetCard from '@/components/bet-card';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import ScreenHeader from '@/components/screen-header';
import ScreenWrapper from '@/components/screen-wrapper';
import { Skeleton } from '@/components/skeleton';
import { MatchCardSkeleton } from '@/components/skeleton/match-card-skeleton';
import { colors } from '@/constants/colors';
import { useGetMatches } from '@/services/matches/match-query';

import HomeScreenHeader from '../../components/home-screen-header';

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <ScreenWrapper safeArea={false} backgroundColor={colors.greyLight}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>{children}</View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default function HomeScreen() {
  const { data, isPending, error } = useGetMatches({});

  if (isPending) {
    return (
      <Wrapper>
        <ScreenHeader safeArea>
          <HomeScreenHeader />
        </ScreenHeader>
        <SafeHorizontalView>
          <Skeleton.Group count={7} gap={0}>
            <MatchCardSkeleton />
          </Skeleton.Group>
        </SafeHorizontalView>
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
      <ScreenHeader>
        <HomeScreenHeader />
      </ScreenHeader>
      <SafeHorizontalView>
        {Object.values(data.data ?? []).map((match: any) => (
          <BetCard key={match.id} match={match} />
        ))}
      </SafeHorizontalView>
    </Wrapper>
  );
}
