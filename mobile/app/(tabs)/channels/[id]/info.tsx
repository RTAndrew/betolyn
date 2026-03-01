import AntDesign from '@expo/vector-icons/AntDesign';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import { colors } from '@/constants/colors';
import { mockAPI } from '@/mock';
import { IChannelMember } from '@/mock/matches';

const ParticipantCard = ({ member }: { member: IChannelMember }) => {
  const handlePress = () => {
    Alert.alert(`Remover ${member.name}`, 'Tem certeza que deseja remover este participante?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () => console.log('remover'),
      },
    ]);
  };

  return (
    <TouchableOpacity activeOpacity={0.5} onPress={handlePress}>
      <View style={styles.participantCard}>
        <Text style={styles.participantName}>{member.name}</Text>

        <View style={styles.participantBody}>
          {member.role === 'admin' && <Text style={styles.participantRole}>{member.role}</Text>}
          <Text style={styles.participantGains}>1000</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Info = () => {
  const { id } = useLocalSearchParams();
  const channel = mockAPI.getChannelById(Number(id));

  if (!channel) {
    return <Text>Channel not found</Text>;
  }

  return (
    <ParallaxScrollView
      backgroundColor={colors.greyMedium}
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <View
          style={{
            flex: 1,
            width: '100%',
          }}
        >
          <Image
            resizeMode="cover"
            source={{ uri: channel.image_url }}
            style={{
              flex: 1,
              width: '100%',
            }}
          />

          {/* Image Overlay */}
          <View
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />

          <ThemedView style={styles.headerBodyWrapper}>
            <TouchableOpacity style={styles.headerBodyIcon} onPress={() => router.back()}>
              <AntDesign name="arrow-left" size={24} color="white" />
            </TouchableOpacity>

            <View style={styles.headerBody}>
              <Text style={styles.headerBodyTitle}>{channel.name}</Text>
              <Text style={styles.headerBodyDescription}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet, nulla tristique enim
                urna, ullamcorper porta sit...
              </Text>
            </View>
          </ThemedView>
        </View>
      }
    >
      <ThemedView style={styles.channelInfo}>
        <Text style={styles.channelInfoText}>
          Criado por {channel.created_by}, {new Date(channel.created_at).toLocaleDateString()}
        </Text>
        <Text style={styles.channelInfoText}>Chatroom ID: 7859697414785576</Text>
      </ThemedView>

      <ThemedView style={styles.participants}>
        <Text style={styles.participantsNumber}>{channel.members.length} Participantes</Text>

        <View style={{ flex: 1, gap: 5 }}>
          {channel.members.map((member, index) => (
            <ParticipantCard key={index} member={member} />
          ))}
        </View>
      </ThemedView>
    </ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  participantCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.25,
    borderBottomColor: colors.greyLighter,
  },
  participantName: {
    fontWeight: '600',
    color: colors.white,
  },
  participantRole: {
    fontSize: 12,
    color: colors.white,
  },
  participantBody: {
    flexDirection: 'row',
    gap: 5,
  },
  participantGains: {
    fontSize: 12,
    color: colors.white,
  },

  headerBodyWrapper: {
    backgroundColor: 'transparent',
    padding: 16,
    position: 'absolute',
    top: 10,
    bottom: 30,
    left: 20,
    right: 20,
  },
  headerBody: {
    position: 'absolute',
    bottom: 0,
  },
  headerBodyIcon: {
    position: 'absolute',
    left: 0,
    top: 16,
  },
  headerBodyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
  },
  headerBodyDescription: {
    fontSize: 10,
    color: colors.white,
  },
  channelInfo: {
    flexDirection: 'column',
    paddingVertical: 22,
    gap: 5,
  },
  channelInfoText: {
    fontSize: 10,
    color: colors.white,
  },
  participants: {
    backgroundColor: colors.greyMedium,
    paddingVertical: 16,
    gap: 5,
    flex: 1,
    height: '100%',
  },
  participantsNumber: {
    fontWeight: 'bold',
    color: colors.complementary,
  },
});

export default Info;
