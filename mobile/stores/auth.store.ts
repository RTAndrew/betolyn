import { constants } from '@/constants';
import { AuthService } from '@/services';
import { IUser } from '@/types';
import { SafeStorage } from '@/utils/safe-storage';
import { computed, signal } from '@preact/signals-react';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

interface IAuthStore extends IUser {
  token: string;
  sessionId: string;
}

const user = signal<IAuthStore | null>(null);
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

  const { data, error } = await AuthService.getMe();
  if (error) {
    await handleLogout();
    return;
  }

  user.value = {
    ...data.user,
    token,
    sessionId: data.sessionId,
  };
};

export const authStore = {
  user,
  isLoggedIn,
  handleLogout,
};
