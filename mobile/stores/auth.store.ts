import { computed, signal } from '@preact/signals-react';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import { constants } from '@/constants';
import { IMe, MeService } from '@/services';
import { SafeStorage } from '@/utils/safe-storage';

const user = signal<IMe | null>(null);
const isLoggedIn = computed(() => user.value !== null);

const handleLogout = async () => {
  await SecureStore.deleteItemAsync(constants.session.tokenStorageKey);
  await SecureStore.deleteItemAsync(constants.session.userStorageKey);
  authStore.user.value = null;
  router.dismissAll();
};

export const hydrateAuthStore = async () => {
  if (user.value) return; // Already hydrated

  const token = SafeStorage.get(constants.session.tokenStorageKey);
  if (!token) {
    return;
  }

  const { data, error } = await MeService.getMe();
  if (error) {
    await handleLogout();
    return;
  }

  user.value = data;
};

export const authStore = {
  user,
  isLoggedIn,
  handleLogout,
};
