# React Query API Hooks

This directory contains React Query hooks for managing server state in the frontend.

## Available Hooks

### `useBackendHealth()`
Checks if the backend is reachable and returns the response.

```tsx
import { useBackendHealth } from './queries';

function MyComponent() {
  const { data, isLoading, error, isError } = useBackendHealth();
  
  if (isLoading) return <div>Checking backend...</div>;
  if (isError) return <div>Backend not reachable: {error.message}</div>;
  
  return <div>Backend is running: {data}</div>;
}
```

### `useBackendStatus()`
Simplified hook for checking backend connection status.

```tsx
import { useBackendStatus } from './queries';

function ConnectionStatus() {
  const { isConnected, isLoading, error } = useBackendStatus();
  
  return (
    <div>
      {isLoading ? 'Checking...' : isConnected ? 'Connected' : `Disconnected: ${error}`}
    </div>
  );
}
```

### `useOnboardingMutation()`
Handles onboarding form submission with optimistic updates.

```tsx
import { useOnboardingMutation } from './queries';

function OnboardingForm() {
  const mutation = useOnboardingMutation();
  
  const handleSubmit = (data: OnboardingData) => {
    mutation.mutate(data, {
      onSuccess: (result) => {
        console.log('Onboarding successful:', result);
        // Navigate to next step
      },
      onError: (error) => {
        console.error('Onboarding failed:', error);
        // Show error message
      }
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button 
        type="submit" 
        disabled={mutation.isPending}
      >
        {mutation.isPending ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
```

## Benefits of React Query

1. **Automatic Caching**: Queries are cached and shared across components
2. **Background Refetching**: Data stays fresh automatically
3. **Optimistic Updates**: UI updates immediately, rolls back on error
4. **Error Handling**: Built-in retry logic and error states
5. **Loading States**: Easy access to loading, error, and success states
6. **DevTools**: Built-in debugging tools (available in development)

## Query Keys

Query keys are used for caching and invalidation:

```tsx
export const queryKeys = {
  backend: ['backend'] as const,
  onboarding: ['onboarding'] as const,
} as const;
```

## Adding New Queries

To add a new API endpoint:

1. Add the API function to `api.ts`
2. Add query key to `queryKeys`
3. Create a hook in `queries.ts`
4. Use the hook in your components

Example:
```tsx
// In api.ts
export async function fetchUser(id: string) {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

// In queries.ts
export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUser(id),
    enabled: !!id, // Only run if id exists
  });
}
``` 