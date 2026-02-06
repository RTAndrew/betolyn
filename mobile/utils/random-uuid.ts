const DEFAULT_SIZE = 5;

const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/**
 * Generates a pseudo-random string composed of [a-z][A-Z][0-9].
 *
 * @param size Length of the generated string. Defaults to 16.
 */
export function randomUUID(size: number = DEFAULT_SIZE): string {
  const length = Number.isFinite(size) && size > 0 ? Math.floor(size) : DEFAULT_SIZE;

  let result = '';

  for (let i = 0; i < length; i += 1) {
    const index = Math.floor(Math.random() * ALPHABET.length);
    result += ALPHABET[index];
  }

  return result;
}
