import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ParticipantCard = () => {
  const handlePress = () => {
    Alert.alert('Remover participante', 'Tem certeza que deseja remover este participante?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Remover',
        onPress: () => console.log('remover'),
      },
    ]);
  };

  return (
    <TouchableOpacity activeOpacity={0.5} onPress={handlePress}>
      <View style={styles.participantCard}>
        <Text style={styles.participantName}>John Doe</Text>

        <View style={styles.participantBody}>
          <Text style={styles.participantRole}>Admin</Text>
          <Text style={styles.participantGains}>1000</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Info = () => {
  return (
    <ParallaxScrollView
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
            source={require('@/assets/images/beach_soccer_cup.png')}
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
              <AntDesign name="arrowleft" size={24} color="white" />
            </TouchableOpacity>

            <View style={styles.headerBody}>
              <Text style={styles.headerBodyTitle}>Campeonato Futebol de Praia (Samba) 19/20</Text>
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
        <Text style={styles.channelInfoText}>Criado por divaldo.ghost, 21/03/2020</Text>
        <Text style={styles.channelInfoText}>Chatroom ID: 7859697414785576</Text>
      </ThemedView>

      <ThemedView style={styles.participants}>
        <Text style={styles.participantsNumber}>20 Participantes</Text>

        {Array.from({ length: 20 }).map((_, index) => (
          <ParticipantCard key={index} />
        ))}
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
    borderBottomColor: '#C7D1E7',
  },
  participantName: {
    fontWeight: '600',
    color: 'white',
  },
  participantRole: {
    fontSize: 12,
    color: 'white',
  },
  participantBody: {
    flexDirection: 'row',
    gap: 5,
  },
  participantGains: {
    fontSize: 12,
    color: 'white',
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
    color: 'white',
    marginBottom: 8,
  },
  headerBodyDescription: {
    fontSize: 10,
    color: 'white',
  },
  channelInfo: {
    flexDirection: 'column',
    paddingVertical: 22,
    gap: 5,
  },
  channelInfoText: {
    fontSize: 10,
    color: 'white',
  },
  participants: {
    backgroundColor: '#485164',
    paddingVertical: 16,
    gap: 5,
    flex: 1,
    height: '100%',
  },
  participantsNumber: {
    fontWeight: 'bold',
    color: '#F3CA41',
  },
});

export default Info;
