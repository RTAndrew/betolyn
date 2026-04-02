import { useSignals } from '@preact/signals-react/runtime';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { constants } from '@/constants';
import { colors } from '@/constants/colors';
import { authStore } from '@/stores/auth.store';

const HomeHeader = () => {
  useSignals();
  const { user, isLoggedIn } = authStore;

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync(constants.session.tokenStorageKey);
    await SecureStore.deleteItemAsync(constants.session.userStorageKey);
    authStore.user.value = null;
  };

  if (!isLoggedIn.value) {
    return (
      <View style={styles.root}>
        <ThemedText onPress={() => router.push('/auth/login')}> Sign In </ThemedText>
        <ThemedText onPress={() => handleLogout()}> Logout </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Pressable onPress={() => router.push('/me')} style={styles.userBadge}>
        <ThemedText style={styles.userBadgeText}>
          {user.value?.user.username.slice(0, 2).toUpperCase()}
        </ThemedText>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    width: 42,
    height: 42,
    backgroundColor: colors.terciary,
    borderRadius: '100%',
    borderWidth: 1,
    borderColor: colors.greyLighter,
  },
  userBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default HomeHeader;
