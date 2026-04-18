import { useSignals } from '@preact/signals-react/runtime';
import { router } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet } from 'react-native';

import { Button } from '@/components/button';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import ScreenHeader from '@/components/screen-header';
import { Settings } from '@/components/settings';
import { ThemedText } from '@/components/ThemedText';
import { colors } from '@/constants/colors';
import { authStore } from '@/stores/auth.store';
import { formatKwanzaAmount } from '@/utils/number-formatters';

const GENERIC_AVATAR = require('@/assets/images/generic-user-profile-image.png');

const AuthenticatedUserProfile = () => {
  useSignals();
  const { user: data } = authStore;

  if (!data.value) return <></>;
  const { balance, user } = data.value;

  return (
    <ScrollView stickyHeaderIndices={[0]} style={styles.root}>
      <ScreenHeader onClose={() => router.back()} />

      <SafeHorizontalView style={styles.userCard}>
        <Image source={GENERIC_AVATAR} style={styles.avatar} accessibilityIgnoresInvertColors />

        <ThemedText type="title">{user.username}</ThemedText>
      </SafeHorizontalView>

      <SafeHorizontalView style={styles.content}>
        <Settings.ItemGroup
          title="Balance"
          description={{
            title: 'See transactions',
            onPress: () => router.push('/(modals)/transactions'),
          }}
        >
          <Settings.Item
            title="Available"
            suffixIcon={false}
            description={formatKwanzaAmount(balance?.available)}
          />
          <Settings.Item
            title="Reserved"
            suffixIcon={false}
            description={formatKwanzaAmount(balance?.reserved)}
          />
        </Settings.ItemGroup>

        <Settings.ItemGroup title="Account">
          <Settings.Item title="Account ID" suffixIcon={false} description={user.id} />
          <Settings.Item title="Username" suffixIcon={false} description={user.username} />
          <Settings.Item title="Email" suffixIcon={false} description={user.email} />
        </Settings.ItemGroup>

        <Button.Root onPress={() => authStore.handleLogout()} style={styles.logoutButton}>
          Logout
        </Button.Root>
      </SafeHorizontalView>
    </ScrollView>
  );
};

export default AuthenticatedUserProfile;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.greyMedium,
  },
  content: {
    gap: 24,
  },
  logoutButton: {
    marginTop: 56,
    backgroundColor: colors.secondary,
  },
  userCard: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    marginBottom: 42,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 100,
  },
  userCardTitle: {
    textAlign: 'center',
    fontSize: 24,
  },
});
