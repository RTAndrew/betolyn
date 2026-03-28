/** Default minimum time the async-processing sheet keeps the loading state visible. */
export const DEFAULT_MIN_ASYNC_DELAY_MS = 800;

export const fakePromise = (ms = 2000): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

/**
 * Runs `work` in parallel with a fixed delay. Completes when both finish (like Promise.all on duration).
 * Uses Promise.allSettled so a rejection from `work` is returned as a rejected result rather than skipping the delay.
 */
export async function withMinimumLoadingDuration<T>(
  work: () => Promise<T>,
  minDelayMs: number = DEFAULT_MIN_ASYNC_DELAY_MS
): Promise<PromiseSettledResult<T>> {
  const [workResult] = await Promise.allSettled([work(), fakePromise(minDelayMs)]);
  return workResult;
}
