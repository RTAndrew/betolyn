import { Button } from '@/components/button'
import SafeHorizontalView from '@/components/safe-horizontal-view'
import ScreenHeader from '@/components/screen-header'
import { ThemedText } from '@/components/ThemedText'
import { authStore } from '@/stores/auth.store'
import { useSignals } from '@preact/signals-react/runtime'
import { router } from 'expo-router'
import React from 'react'
import { StyleSheet, View } from 'react-native'

const Me = () => {
  useSignals();
  const { user } = authStore;

  return (
    <View style={styles.root}>
      <ScreenHeader safeArea={false} title="Minha conta" onClose={() => router.back()} />

      <SafeHorizontalView>
        <ThemedText type="title">{user.value?.username}</ThemedText>
        <Button.Root onPress={() => authStore.handleLogout()} style={styles.logoutButton}>Logout</Button.Root>
      </SafeHorizontalView>
    </View>
  )
}

export default Me

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#61687E',
  },
  logoutButton: {
    marginTop: 56,
  },
});