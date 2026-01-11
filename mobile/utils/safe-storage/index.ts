import * as SecureStore from 'expo-secure-store';

export class SafeStorage {
  static save(key: string, value: string) {
    SecureStore.setItem(key, value);
  }

  static async saveAsync(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
  }

  /**
   * Save an object to the secure storage, by converting it to a string first
   * @param key - The key to save the object to
   * @param value - The object to save
   */
  static saveObject(key: string, value: any) {
    const valueString = JSON.stringify(value);
    SecureStore.setItemAsync(key, valueString);
  }
  /**
   * Save an object to the secure storage, by converting it to a string first
   * @param key - The key to save the object to
   * @param value - The object to save
   */
  static async saveObjectAsync(key: string, value: any) {
    const valueString = JSON.stringify(value);
    await SecureStore.setItemAsync(key, valueString);
  }

  static get(key: string) {
    return SecureStore.getItem(key);
  }

  /**
   * Get an object from the secure storage, by converting the string to an object
   * @param key - The key to get the object from
   * @returns The object
   */
  static async getObjectAsync(key: string) {
    const valueString = await SecureStore.getItemAsync(key);

    if (valueString === null) return null;
    return JSON.parse(valueString);
  }

  static async delete(key: string) {
    await SecureStore.deleteItemAsync(key);
  }
}
