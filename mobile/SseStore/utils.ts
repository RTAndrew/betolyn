import { QueryClient } from '@tanstack/react-query';

// Lazy import to avoid circular dependency
let sseQueryClient: QueryClient | null = null;

export const getSseQueryClient = (): QueryClient => {
  if (!sseQueryClient) {
    const { sseClientStore } = require('./provider');
    sseQueryClient = sseClientStore;
  }
  return sseQueryClient;
};
