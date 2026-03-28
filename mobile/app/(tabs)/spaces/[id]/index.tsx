import AntDesign from '@expo/vector-icons/AntDesign';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';

import { Button } from '@/components/button';
import EmptyState from '@/components/empty-state';
import { Add } from '@/components/icons';
import ScreenHeader from '@/components/screen-header';
import ScreenWrapper from '@/components/screen-wrapper';
import { Skeleton } from '@/components/skeleton';
import { MatchCardSkeleton } from '@/components/skeleton/match-card-skeleton';
import { colors } from '@/constants/colors';
import { mockData } from '@/mock/matches';
import { useGetSpaceById } from '@/services';

const SpaceId = () => {
  const { id } = useLocalSearchParams();
  const { data, error, isPending } = useGetSpaceById({ spaceId: id as string });

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

  return (
    <ScrollView
      stickyHeaderIndices={[0]}
      stickyHeaderHiddenOnScroll
      contentContainerStyle={{ flexGrow: 1 }}
    >
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
        </ScreenHeader.QuickActions>
      </ScreenHeader>

      <View style={{ backgroundColor: colors.greyLight, flex: 1 }}>
        <EmptyState.NoSearch
          center
          title="No event has been created yet"
          description="Create the first event and turn your community more engaged"
        >
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
        </EmptyState.NoSearch>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.greyMedium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'transparent',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
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
});

export default SpaceId;
