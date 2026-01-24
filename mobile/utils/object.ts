
/**
 * Copies only the fields that exist in `source` onto `target`, returning a new object.
 * Properties in `target` that are not in `source` remain unchanged.
 * Does not mutate the original objects.
 * If this is not enough, use "@fastify/deepmerge" instead.
 * @param target - The base object. If null/undefined, treated as {}.
 * @param source - The object whose keys/values to copy over.
 * @returns A new object with target's properties plus source's properties (only for keys present in source).
 *
 * @example
 * patch({ id: 1, name: 'foo', status: 'old' }, { id: 1, status: 'active' })
 * // => { id: 1, name: 'foo', status: 'active' }
 */
export function patch<T extends object, S extends object>(
  target: T | null | undefined,
  source: S | null | undefined
): T & Partial<S> {
  const result = (target != null ? { ...target } : {}) as T & Partial<S>;
  if (source == null) return result;

  for (const key of Object.keys(source)) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      (result as Record<string, unknown>)[key] = (source as Record<string, unknown>)[key];
    }
  }
  return result;
}
