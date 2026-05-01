import AntDesign from '@expo/vector-icons/AntDesign';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';

import BetCard from '@/components/bet-card';
import { Button } from '@/components/button';
import EmptyState from '@/components/empty-state';
import { Add } from '@/components/icons';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import ScreenHeader from '@/components/screen-header';
import ScreenWrapper from '@/components/screen-wrapper';
import { Skeleton } from '@/components/skeleton';
import { MatchCardSkeleton } from '@/components/skeleton/match-card-skeleton';
import { useIsSpaceAdmin } from '@/components/space-guard';
import { colors } from '@/constants/colors';
import { mockData } from '@/mock/matches';
import { useGetSpaceById, useGetSpaceMatches } from '@/services';
import { IMatch } from '@/types';

const SpaceId = () => {
  const { id } = useLocalSearchParams();
  const spaceId = id as string;
  const { data, error, isPending } = useGetSpaceById({ spaceId });
  const { isAdmin: canCreateEvents } = useIsSpaceAdmin(spaceId);
  const {
    data: matchesRes,
    error: matchesError,
    isPending: matchesPending,
  } = useGetSpaceMatches({ spaceId, queryOptions: { enabled: !!spaceId } });

  if (isPending) {
    return (
      <ScreenWrapper backgroundColor={colors.greyLight} scrollable={true} safeArea={false}>
        <Skeleton.Group count={5} gap={0}>
          <MatchCardSkeleton />
        </Skeleton.Group>
      </ScreenWrapper>
    );
  }

  if (error || !data) {
    return (
      <ScreenWrapper backgroundColor={colors.greyLight} scrollable={true} safeArea={false}>
        <EmptyState.NoSearch />
      </ScreenWrapper>
    );
  }

  const space = data?.data;
  const matches = matchesRes?.data ?? [];

  const renderHeader = () => (
    <ScreenHeader
      type="back"
      iconContainerColor={colors.greyMedium}
      onClose={() => {
        router.back();
      }}
      style={{
        backgroundColor: colors.greyMedium,
      }}
      title={
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={() => router.push(`/(tabs)/spaces/${id}/info`)}
        >
          <View style={styles.imageContainer}>
            <Image
              resizeMode="contain"
              source={{ uri: mockData.channels[0].image_url }}
              style={{ width: '100%', height: '100%' }}
            />
          </View>

          <Text style={styles.headerTitle}>{space.name}</Text>
        </TouchableOpacity>
      }
    >
      <ScreenHeader.QuickActions style={{ backgroundColor: colors.greyMedium }}>
        <ScreenHeader.Icon onPress={() => {}}>
          <AntDesign name="message" size={24} color="white" />
        </ScreenHeader.Icon>

        {canCreateEvents && (
          <ScreenHeader.Icon
            onPress={() =>
              SheetManager.show('createEventOptionSelection', {
                payload: {
                  spaceId: space.id,
                },
              })
            }
          >
            <Add width={32} height={32} />
          </ScreenHeader.Icon>
        )}
      </ScreenHeader.QuickActions>
    </ScreenHeader>
  );

  const renderEmpty = () => {
    if (matchesPending) {
      return (
        <Skeleton.Group count={5} gap={0}>
          <SafeHorizontalView>
            <MatchCardSkeleton />
          </SafeHorizontalView>
        </Skeleton.Group>
      );
    }
    if (matchesError) {
      return (
        <EmptyState.NoSearch
          center
          title="Could not load events."
          description="Please try again later."
        />
      );
    }
    return (
      <EmptyState.NoSearch
        center
        title="No event was found"
        description={
          canCreateEvents
            ? 'Create the first event and turn your community more engaged'
            : 'The events will appear here once the admin creates them'
        }
      >
        {canCreateEvents && (
          <Button.Root
            onPress={() =>
              SheetManager.show('createEventOptionSelection', {
                payload: {
                  spaceId: space.id,
                },
              })
            }
          >
            Create event
          </Button.Root>
        )}
      </EmptyState.NoSearch>
    );
  };

  const renderItem = ({ item }: { item: IMatch }) => (
    <View style={{ marginHorizontal: 6 }}>
      <SafeHorizontalView>
        <BetCard match={item} showOdds={false} />
      </SafeHorizontalView>
    </View>
  );

  return (
    <FlatList
      data={matches}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={renderEmpty}
      renderItem={renderItem}
      contentContainerStyle={styles.listContent}
      style={{ backgroundColor: colors.greyLight, flex: 1 }}
    />
  );
};

const styles = StyleSheet.create({
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  imageContainer: {
    width: 24,
    height: 24,
    borderRadius: 100,
    // overflow: 'hidden',
  },
  headerTitle: {
    color: 'white',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 120,
  },
});

export default SpaceId;
