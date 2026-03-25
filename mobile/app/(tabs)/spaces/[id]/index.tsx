import AntDesign from '@expo/vector-icons/AntDesign';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BetCard from '@/components/bet-card';
import ScreenWrapper from '@/components/screen-wrapper';
import { Skeleton } from '@/components/skeleton';
import { MatchCardSkeleton } from '@/components/skeleton/match-card-skeleton';
import { ThemedView } from '@/components/ThemedView';
import { colors } from '@/constants/colors';
import { mockAPI } from '@/mock';
import { useGetMatches } from '@/services';

const SpaceId = () => {
  const { id } = useLocalSearchParams();

  const insets = useSafeAreaInsets();
  const channel = mockAPI.getChannelById(Number(id));
  const { data, error, isPending } = useGetMatches({});
  const matches = data?.data;

  if (!channel) {
    return <Text>Channel not found</Text>;
  }

  if (isPending) {
    return (
      <ScreenWrapper backgroundColor={colors.greyLight} scrollable={true} safeArea={false}>
        <Skeleton.Group count={5} gap={0}>
          <MatchCardSkeleton />
        </Skeleton.Group>
      </ScreenWrapper>
    );
  }

  if (!matches || error) {
    return <Text>Error loading matches</Text>;
  }

  return (
    <ScrollView stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll>
      <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
        <ThemedView style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => router.back()}>
              <AntDesign name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.imageContainer}>
              <Image
                resizeMode="contain"
                source={{ uri: channel.image_url }}
                style={{ width: '100%', height: '100%' }}
              />
            </View>

            <TouchableOpacity onPress={() => router.push(`/(tabs)/spaces/${id}/info`)}>
              <Text style={styles.headerTitle}>{channel.name}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => router.push(`/auth/login`)}>
              <AntDesign name="message" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/(modals)/spaces/create')}>
              <AntDesign name="plus" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </ThemedView>
      </View>

      <ThemedView style={{ flex: 1, backgroundColor: colors.greyLight }}>
        {matches.map((match, index) => (
          <BetCard
            key={index}
            match={match}
            onPress={(m) => router.push(`/spaces/${m.id}/create-event`)}
          />
        ))}
      </ThemedView>
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
