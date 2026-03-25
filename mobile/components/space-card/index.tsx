import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '@/constants/colors';
import { mockData } from '@/mock/matches';
import { ISpace } from '@/types';

import SpaceCardSkeleton from './skeleton';

const ChannelCard = ({ channel }: { channel: ISpace }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push(`/(tabs)/spaces/${channel.id}`)}
    >
      <View style={styles.image}>
        <Image
          resizeMode="contain"
          source={{ uri: mockData.channels[0].image_url }}
          style={{ width: '100%', height: '100%' }}
        />
      </View>

      <View style={styles.body}>
        <View style={styles.descriptionAndTime}>
          <Text style={styles.name}>{channel.name}</Text>
          <Text style={styles.description}>Conor McGregor vs Khabib Nurmagomedov</Text>
        </View>

        <View style={[styles.descriptionAndTime, { alignItems: 'flex-end' }]}>
          <Text style={styles.time}>21:47</Text>
          <Text style={styles.remainingUsers}>100</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 'auto',
    gap: 15,
  },

  body: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    height: 'auto',

    borderBottomWidth: 0.25,
    borderBottomColor: colors.greyLighter,
  },
  image: {
    width: 45,
    height: 45,
    borderRadius: 100,
    overflow: 'hidden',
    // transform: [{ scale: 0.8 }],
  },
  name: {
    color: colors.white,
  },
  description: {
    fontSize: 10,
    color: colors.greyLighter,
  },
  time: {
    color: colors.white,
    fontSize: 10,
  },
  descriptionAndTime: {
    flexDirection: 'column',
    gap: 5,
  },
  remainingUsers: {
    fontSize: 14,
    borderRadius: 100,
    fontWeight: '600',
    color: colors.greyLight,
    backgroundColor: colors.complementary2,
    paddingVertical: 2,
    paddingHorizontal: 5,
  },
});

ChannelCard.Skeleton = SpaceCardSkeleton;

export default ChannelCard;
