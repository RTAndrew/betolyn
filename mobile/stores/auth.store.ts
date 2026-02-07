import { constants } from "@/constants";
import { IUser } from "@/types";
import { SafeStorage } from "@/utils/safe-storage";
import { computed, signal } from "@preact/signals-react";
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
};

const hydrateAuthStore = () => {
  if(user.value) return; // Already hydrated

  const token = SafeStorage.get(constants.session.tokenStorageKey);
  if (token) {

  }
}

export const authStore = {
  user,
  isLoggedIn,
  handleLogout,
};