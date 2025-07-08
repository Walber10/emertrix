import { useQuery } from '@tanstack/react-query';
import { api } from './api';
import type { OnboardingData } from '../hooks/useOnboarding';

// Auth types moved from auth.ts
export interface User {
  _id: string;
  organizationId: string;
  name: string;
  email: string;
  phone?: string;
  role: 'master' | 'admin' | 'occupant';
  isPointOfContact: boolean;
  inviteStatus: 'pending' | 'accepted';
  createdAt: string;
  profilePicture?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user: User;
  error?: string;
}

export interface MeResponse {
  success: boolean;
  user: User;
  error?: string;
}

// Auth API functions moved from auth.ts
export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getMe: async (): Promise<MeResponse> => {
    const response = await api.get<MeResponse>('/auth/me');
    return response.data;
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/auth/forgot-password', { email });
    return response.data;
  },
};

// Query keys
export const queryKeys = {
  backend: ['backend'] as const,
  auth: {
    me: ['auth', 'me'] as const,
  },
  onboarding: ['onboarding'] as const,
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

// Backend health check query
export function useBackendHealth() {
  return useQuery({
    queryKey: queryKeys.backend,
    queryFn: async () => {
      const response = await api.get('/');
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds
    retry: 2,
  });
}

// Auth queries
export function useMeQuery() {
  return useQuery<User, Error>({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      try {
        const response = await authApi.getMe();
        if (!response.success) {
          throw new Error(response.error || 'Authentication failed');
        }
        return response.user;
      } catch (error: unknown) {
        // If it's a 401 error, don't retry - user is just not authenticated
        if (
          error &&
          typeof error === 'object' &&
          'response' in error &&
          typeof error.response === 'object' &&
          error.response &&
          'status' in error.response &&
          error.response.status === 401
        ) {
          throw new Error('Not authenticated');
        }
        throw error;
      }
    },
    retry: (failureCount, error) => {
      // Don't retry on 401 errors (not authenticated)
      if (error?.message === 'Not authenticated') {
        return false;
      }
      // Don't retry at all for auth queries
      return false;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
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

// Organization queries
export function useOrganizationsQuery() {
  return useQuery({
    queryKey: queryKeys.organizations.all,
    queryFn: async () => {
      const response = await api.get('/master/organizations');
      return response.data;
    },
  });
}

export function useOrganizationQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.organizations.byId(id),
    queryFn: async () => {
      const response = await api.get(`/master/organizations/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// User queries
export function useUsersQuery() {
  return useQuery({
    queryKey: queryKeys.users.all,
    queryFn: async () => {
      const response = await api.get('/master/users');
      return response.data;
    },
    enabled: false, // Only fetch when needed
  });
}

export function useUserQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.users.byId(id),
    queryFn: async () => {
      const response = await api.get(`/master/users/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// Facility queries
export function useFacilitiesQuery() {
  return useQuery({
    queryKey: queryKeys.facilities.all,
    queryFn: async () => {
      const response = await api.get('/facilities');
      return response.data;
    },
    enabled: false, // Only fetch when needed
  });
}

export function useFacilityQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.facilities.byId(id),
    queryFn: async () => {
      const response = await api.get(`/facilities/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}
