import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Refetch on window focus to catch status updates
      refetchOnWindowFocus: true,
      // Keep data fresh for 30 seconds - short enough to catch updates
      staleTime: 30 * 1000,
      // Cache data for 5 minutes
      gcTime: 5 * 60 * 1000,
      // Retry failed requests once
      retry: 1,
      // Refetch on mount to ensure fresh data
      refetchOnMount: true,
    },
  },
});
