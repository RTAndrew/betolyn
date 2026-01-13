import { DefaultOptions, QueryClient } from "@tanstack/react-query";

export const DEFAULT_QUERY_CONFIG = {
  queries: {
    retry: false,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  },
} satisfies DefaultOptions;


export const queryClient = new QueryClient({
  defaultOptions: DEFAULT_QUERY_CONFIG,
});
