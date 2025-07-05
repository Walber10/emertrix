import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pingBackend, submitOnboarding } from './api';
import type { OnboardingData, OnboardingResponse } from '../hooks/useOnboarding';

// Query keys
export const queryKeys = {
  backend: ['backend'] as const,
  onboarding: ['onboarding'] as const,
} as const;

// Backend health check query
export function useBackendHealth() {
  return useQuery({
    queryKey: queryKeys.backend,
    queryFn: pingBackend,
    staleTime: 30 * 1000, // 30 seconds
    retry: 2,
  });
}

// Onboarding mutation with optimistic updates
export function useOnboardingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OnboardingData) => submitOnboarding(data),
    onMutate: async newOnboarding => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: queryKeys.onboarding });

      // Snapshot the previous value
      const previousOnboarding = queryClient.getQueryData(queryKeys.onboarding);

      // Optimistically update to the new value
      queryClient.setQueryData(queryKeys.onboarding, (old: OnboardingResponse | undefined) => {
        // You could create a mock response here for optimistic updates
        return old;
      });

      // Return a context object with the snapshotted value
      return { previousOnboarding };
    },
    onError: (err, newOnboarding, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousOnboarding) {
        queryClient.setQueryData(queryKeys.onboarding, context.previousOnboarding);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.onboarding });
    },
  });
}

// Hook for checking if backend is available (useful for showing connection status)
export function useBackendStatus() {
  const { data, isLoading, error, isError } = useBackendHealth();

  return {
    isConnected: !isError && !isLoading,
    isLoading,
    error: error?.message,
    data,
  };
}
