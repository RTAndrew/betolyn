import { router } from 'expo-router';
import React, { PropsWithChildren } from 'react';
import { FlatList, Platform } from 'react-native';

import EmptyState from '@/components/empty-state';
import FullScreenCentered from '@/components/full-screen-centered';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import ScreenHeader from '@/components/screen-header';
import ScreenWrapper from '@/components/screen-wrapper';
import { Skeleton } from '@/components/skeleton';
import { ThemedText } from '@/components/ThemedText';
import { colors } from '@/constants/colors';
import { useGetMyBets } from '@/services/me/me-query';
import { IBetSlipItem } from '@/types';

import BetSlipItemCard from './bet-slip-item-history';
import { BetSlipItemCardSkeleton } from './bet-slip-item-history/skeleton';

const Header = ({ children }: PropsWithChildren) => {
  return (
    <ScreenWrapper scrollable={false} safeArea={false} backgroundColor={colors.greyLight}>
      <ScreenHeader
        iconContainerColor={colors.greyMedium}
        type="back"
        onClose={() => router.back()}
        safeArea
        title="Histórico"
      />
      {children}
    </ScreenWrapper>
  );
};

const BetSlipHistoryScreen = () => {
  const { data, error, isPending } = useGetMyBets({});

  if (isPending) {
    return (
      <Header>
        <SafeHorizontalView style={{ marginTop: 18 }}>
          <Skeleton.Group>
            <BetSlipItemCardSkeleton />
          </Skeleton.Group>
        </SafeHorizontalView>
      </Header>
    );
  }

  if (error || !data) {
    return (
      <Header>
        <ThemedText>Erro ao carregar apostas</ThemedText>
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
    <ScreenWrapper scrollable={false} safeArea={false} backgroundColor={colors.greyLight}>
      <ScreenHeader
        safeArea
        type="back"
        title="Histórico"
        onClose={() => router.back()}
        iconContainerColor={colors.greyMedium}
      />

      <FlatList
        data={betSlips}
        contentContainerStyle={{
          gap: 8,
          marginTop: 18,
          paddingBottom: Platform.OS === 'ios' ? 200 : 130,
        }}
        renderItem={({ item: slip }) => {
          return (
            <SafeHorizontalView>
              <BetSlipItemCard key={slip.id} bet={slip} />
            </SafeHorizontalView>
          );
        }}
        ListEmptyComponent={
          <FullScreenCentered includeTabBar>
            <SafeHorizontalView>
              <EmptyState.NoBets />
            </SafeHorizontalView>
          </FullScreenCentered>
        }
      />
    </ScreenWrapper>
  );
};

export default BetSlipHistoryScreen;
