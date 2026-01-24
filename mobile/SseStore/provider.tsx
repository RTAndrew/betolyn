
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import StreamEventSource from "./StreamEventSource";

export const sseClientStore = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      staleTime: 0,
      gcTime: Infinity,
    },
  },
});


export const SSEProvider = ({ children }: { children: React.ReactNode }) => {

  return (
    <QueryClientProvider client={sseClientStore}>
      <StreamEventSource />
      {children}
    </QueryClientProvider>
  );
};
