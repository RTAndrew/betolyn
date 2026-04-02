import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Add, DollarEuro, UserAdd } from '@/components/icons';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import ScreenHeader from '@/components/screen-header';
import ScreenWrapper from '@/components/screen-wrapper';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { colors } from '@/constants/colors';
import { IChannelMember, mockData } from '@/mock/matches';
import { useGetSpaceById } from '@/services';

const _ParticipantCard = ({ member }: { member: IChannelMember }) => {
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

interface IActionsProps {
  title: string;
  onPress?: () => void;
  icon: React.ReactNode;
}

const Actions = ({ title, onPress, icon }: IActionsProps) => {
  return (
    <Pressable onPress={onPress} style={styles.action}>
      <View style={styles.actionIcon}>{icon}</View>
      <ThemedText type="defaultSemiBold">{title}</ThemedText>
    </Pressable>
  );
};

const Info = () => {
  const { id } = useLocalSearchParams();
  const { data, error, isPending } = useGetSpaceById({ spaceId: id as string });

  if (isPending) {
    return (
      <ScreenWrapper backgroundColor={colors.greyLight} scrollable={true} safeArea={false}>
        <ActivityIndicator size="large" color={colors.white} />
      </ScreenWrapper>
    );
  }

  if (error || !data) {
    return <Text>Error loading space</Text>;
  }

  const space = data?.data;

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
            source={{ uri: mockData.channels[0].image_url }}
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

          <View style={styles.headerBodyWrapper}>
            <ScreenHeader
              iconContainerColor="transparent"
              safeArea={true}
              type="back"
              onClose={() => router.back()}
            />

            <SafeHorizontalView style={styles.headerBody}>
              <Text style={styles.headerBodyTitle}>{space.name}</Text>
              <Text style={styles.headerBodyDescription}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet, nulla tristique enim
                urna, ullamcorper porta sit...
              </Text>
            </SafeHorizontalView>
          </View>
        </View>
      }
    >
      <SafeHorizontalView style={styles.actions}>
        <Actions title="Withdraw" icon={<DollarEuro width={24} height={24} />} />
        <Actions
          onPress={() => router.push(`/(modals)/spaces/${id}/fund`)}
          title="Allocate funds"
          icon={<Add width={24} height={24} />}
        />
        <Actions title="Invite" icon={<UserAdd width={24} height={24} />} />
      </SafeHorizontalView>

      {/* <ThemedView style={styles.participants}>
        <Text style={styles.participantsNumber}>{spac.members.length} Participantes</Text>

        <View style={{ flex: 1, gap: 5 }}>
          {channel.members.map((member, index) => (
            <ParticipantCard key={index} member={member} />
          ))}
        </View>
      </ThemedView> */}
      <ThemedView style={styles.channelInfo}>
        <Text style={styles.channelInfoText}>
          Criado por {space.createdBy.username}, {new Date().toLocaleDateString()}
        </Text>
        <Text style={styles.channelInfoText}>Chatroom ID: {space.id}</Text>
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
    position: 'absolute',
    top: 0,
    bottom: 30,
    left: 0,
    right: 0,
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
    alignItems: 'center',
    justifyContent: 'center',
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
  action: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  actionIcon: {
    alignItems: 'center',
    justifyContent: 'center',

    width: 56,
    height: 56,
    borderRadius: 100,
    backgroundColor: colors.greyLight,
  },
  actions: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    gap: 16,

    marginVertical: 12,
  },
});

export default Info;
