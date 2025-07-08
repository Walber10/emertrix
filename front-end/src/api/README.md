# React Query API Hooks

This directory contains React Query hooks for managing server state in the frontend using axios for HTTP calls.

## Structure

- `api.ts` - Base axios configuration and interceptors
- `auth.ts` - Auth API functions and types
- `queries.ts` - All query hooks for reading data
- `mutations.ts` - All mutation hooks for writing data
- `index.ts` - Clean exports for all API functions

## Available Hooks

### Query Hooks (queries.ts)

#### `useBackendHealth()`

Checks if the backend is reachable and returns the response.

```tsx
import { useBackendHealth } from '@/api/queries';

function MyComponent() {
  const { data, isLoading, error, isError } = useBackendHealth();

  if (isLoading) return <div>Checking backend...</div>;
  if (isError) return <div>Backend not reachable: {error.message}</div>;

  return <div>Backend is running: {data}</div>;
}
```

#### `useBackendStatus()`

Simplified hook for checking backend connection status.

```tsx
import { useBackendStatus } from '@/api/queries';

function ConnectionStatus() {
  const { isConnected, isLoading, error } = useBackendStatus();

  return (
    <div>{isLoading ? 'Checking...' : isConnected ? 'Connected' : `Disconnected: ${error}`}</div>
  );
}
```

#### `useMeQuery()`

Gets the current authenticated user.

```tsx
import { useMeQuery } from '@/api/queries';

function UserProfile() {
  const { data: user, isLoading, error } = useMeQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Welcome, {user.name}!</div>;
}
```

#### Organization Queries

```tsx
import { useOrganizationsQuery, useOrganizationQuery } from '@/api/queries';

// Get all organizations
function OrganizationsList() {
  const { data: organizations, isLoading } = useOrganizationsQuery();
  // ...
}

// Get specific organization
function OrganizationDetails({ id }: { id: string }) {
  const { data: organization, isLoading } = useOrganizationQuery(id);
  // ...
}
```

#### User Queries

```tsx
import { useUsersQuery, useUserQuery } from '@/api/queries';

// Get all users
function UsersList() {
  const { data: users, isLoading } = useUsersQuery();
  // ...
}

// Get specific user
function UserDetails({ id }: { id: string }) {
  const { data: user, isLoading } = useUserQuery(id);
  // ...
}
```

#### Facility Queries

```tsx
import { useFacilitiesQuery, useFacilityQuery } from '@/api/queries';

// Get all facilities
function FacilitiesList() {
  const { data: facilities, isLoading } = useFacilitiesQuery();
  // ...
}

// Get specific facility
function FacilityDetails({ id }: { id: string }) {
  const { data: facility, isLoading } = useFacilityQuery(id);
  // ...
}
```

### Mutation Hooks (mutations.ts)

#### Auth Mutations

```tsx
import { useLoginMutation, useLogoutMutation, useForgotPasswordMutation } from '@/api/mutations';

function LoginForm() {
  const loginMutation = useLoginMutation();

  const handleSubmit = (email: string, password: string) => {
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          console.log('Login successful');
          // Navigate to dashboard
        },
        onError: error => {
          console.error('Login failed:', error);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

#### Onboarding Mutation

```tsx
import { useOnboardingMutation } from '@/api/mutations';

function OnboardingForm() {
  const mutation = useOnboardingMutation();

  const handleSubmit = (data: OnboardingData) => {
    mutation.mutate(data, {
      onSuccess: result => {
        console.log('Onboarding successful:', result);
        // Navigate to next step
      },
      onError: error => {
        console.error('Onboarding failed:', error);
        // Show error message
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
```

#### CRUD Mutations

```tsx
import {
  useCreateOrganizationMutation,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
} from '@/api/mutations';

function OrganizationForm() {
  const createMutation = useCreateOrganizationMutation();
  const updateMutation = useUpdateOrganizationMutation();
  const deleteMutation = useDeleteOrganizationMutation();

  const handleCreate = (data: OrganizationData) => {
    createMutation.mutate(data);
  };

  const handleUpdate = (id: string, data: Partial<OrganizationData>) => {
    updateMutation.mutate({ id, data });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  // Similar patterns for users and facilities
}
```

## Benefits of This Structure

1. **Separation of Concerns**: Queries for reading, mutations for writing
2. **Consistent Axios Usage**: All HTTP calls use axios with proper interceptors
3. **Type Safety**: Full TypeScript support with proper interfaces
4. **Automatic Caching**: Queries are cached and shared across components
5. **Background Refetching**: Data stays fresh automatically
6. **Optimistic Updates**: UI updates immediately, rolls back on error
7. **Error Handling**: Built-in retry logic and error states
8. **Loading States**: Easy access to loading, error, and success states

## Query Keys

Query keys are organized by domain:

```tsx
export const queryKeys = {
  backend: ['backend'] as const,
  auth: {
    me: ['auth', 'me'] as const,
  },
  organizations: {
    all: ['organizations'] as const,
    byId: (id: string) => ['organizations', id] as const,
  },
  users: {
    all: ['users'] as const,
    byId: (id: string) => ['users', id] as const,
  },
  facilities: {
    all: ['facilities'] as const,
    byId: (id: string) => ['facilities', id] as const,
  },
} as const;
```

## Adding New Endpoints

To add a new API endpoint:

1. Add the API function to the appropriate file (auth.ts for auth, or create a new file)
2. Add query key to `queryKeys` in queries.ts
3. Create a query hook in `queries.ts` for reading data
4. Create a mutation hook in `mutations.ts` for writing data
5. Export from `index.ts` for clean imports

## Usage Examples

```tsx
// Import from the main index
import {
  useMeQuery,
  useLoginMutation,
  useOrganizationsQuery,
  useCreateOrganizationMutation,
} from '@/api';

// Or import from specific files
import { useMeQuery } from '@/api/queries';
import { useLoginMutation } from '@/api/mutations';
```
