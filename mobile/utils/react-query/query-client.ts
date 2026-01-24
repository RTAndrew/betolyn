import { DefaultOptions, QueryClient, UseMutationOptions } from "@tanstack/react-query";

const THREE_MINUTES = 3 * 60 * 1000;

export const DEFAULT_QUERY_CONFIG = {
  queries: {
    retry: false,
    staleTime: THREE_MINUTES,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  },
} satisfies DefaultOptions;

export type ApiFnReturnType<FnType extends (...args: any) => Promise<any>> =
  Awaited<ReturnType<FnType>>;

export type MutationOptions<
  MutationFnType extends (...args: any) => Promise<any>,
> = UseMutationOptions<
  ApiFnReturnType<MutationFnType>,
  Error,
  Parameters<MutationFnType>
>;


export const queryClient = new QueryClient({
  defaultOptions: DEFAULT_QUERY_CONFIG,
});
