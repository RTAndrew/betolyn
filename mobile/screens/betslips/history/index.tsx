import SafeHorizontalView from '@/components/safe-horizontal-view';
import ScreenHeader from '@/components/screen-header';
import ScreenWrapper from '@/components/screen-wrapper';
import { ThemedText } from '@/components/ThemedText';
import { useGetMyBets } from '@/services/me/me-query';
import { IBetSlipItem } from '@/types';
import { colors } from '@/constants/colors';
import { router } from 'expo-router';
import React, { PropsWithChildren } from 'react';
import { ActivityIndicator, FlatList, Platform, View } from 'react-native';
import SingleBetCardHistory from './single-bet-card-history';

const Header = ({ children }: PropsWithChildren) => {
  return (
    <ScreenWrapper scrollable={false} safeArea={false} backgroundColor={colors.greyLight}>
      <ScreenHeader
        iconContainerColor={colors.greyMedium}
        type="back"
        onClose={() => router.back()}
        safeArea
        title="History"
      />
      {children}
    </ScreenWrapper>
  );
};

const BetSlipHistoryScreen = () => {
  const { data, error, isPending } = useGetMyBets();

  if (isPending) {
    return (
      <Header>
        <ActivityIndicator size="large" color="#fff" />
      </Header>
    );
  }

  if (error || !data) {
    return (
      <Header>
        <ThemedText>Error loading bets</ThemedText>
      </Header>
    );
  }

  const betSlips = (data?.data ?? []).reduce((acc, slip) => {
    if (slip.type === 'SINGLE') {
      return acc.concat(slip.items);
    }
    return acc;
  }, [] as IBetSlipItem[]);

  return (
    <>
      <View style={{ backgroundColor: colors.greyLight, flex: 1 }}>
        <ScreenHeader
          iconContainerColor={colors.greyMedium}
          type="back"
          onClose={() => router.back()}
          safeArea
          title="History"
        />

        <FlatList
          contentContainerStyle={{
            gap: 8,
            marginTop: 18,
            paddingBottom: Platform.OS === 'ios' ? 200 : 130,
          }}
          data={betSlips}
          renderItem={({ item: slip }) => {
            return (
              <SafeHorizontalView>
                <SingleBetCardHistory key={slip.id} bet={slip} />
              </SafeHorizontalView>
            );
          }}
        />
      </View>
    </>
  );
};

export default BetSlipHistoryScreen;
