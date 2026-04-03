import { useSignals } from '@preact/signals-react/runtime';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import ScreenHeader from '@/components/screen-header';
import { Settings } from '@/components/settings';
import { ThemedText } from '@/components/ThemedText';
import { colors } from '@/constants/colors';
import { formatKwanzaAmount } from '@/screens/spaces/allocate-funds/utils';
import { authStore } from '@/stores/auth.store';

const Me = () => {
  useSignals();
  const { user: data } = authStore;

  if (!data.value) return <></>;
  const { balance, user } = data.value;

  return (
    <View style={styles.root}>
      <ScreenHeader title="Minha conta" onClose={() => router.back()} />

      <SafeHorizontalView style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          {user.username}
        </ThemedText>

        <Settings.ItemGroup title="Account">
          <Settings.Item title="Username" suffixIcon={false} description={user.username} />
          <Settings.Item title="Email" suffixIcon={false} description={user.email} />
        </Settings.ItemGroup>

        <Settings.ItemGroup title="Wallet">
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

        <Button.Root onPress={() => authStore.handleLogout()} style={styles.logoutButton}>
          Logout
        </Button.Root>
      </SafeHorizontalView>
    </View>
  );
};

export default Me;

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
  },
  title: {
    marginVertical: 24,
  },
});
