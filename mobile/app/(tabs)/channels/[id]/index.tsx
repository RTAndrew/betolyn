import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import BetCard from '@/components/bet-card';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router, useLocalSearchParams } from 'expo-router';
import { mockAPI } from '@/mock';

const ChannelId = () => {
  const { id } = useLocalSearchParams();
  const channel = mockAPI.getChannelById(Number(id));

  if (!channel) {
    return <Text>Channel not found</Text>;
  }

  return (
    <ScrollView>
      <View style={styles.headerContainer}>
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

            <TouchableOpacity onPress={() => router.push(`/(tabs)/channels/${id}/info`)}>
              <Text style={styles.headerTitle}>{channel.name}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.headerRight}>
            <AntDesign name="message" size={24} color="white" />
            <TouchableOpacity onPress={() => router.push(`/modal/channels/${id}/create-event`)}>
              <AntDesign name="plus" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </ThemedView>
      </View>

      <ThemedView style={{ flex: 1, backgroundColor: '#61687E' }}>
        {mockAPI.getMatches().map((match, index) => (
          <BetCard key={index} match={match} />
        ))}
      </ThemedView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#485164',
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

export default ChannelId;
