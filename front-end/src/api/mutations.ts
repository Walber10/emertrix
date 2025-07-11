import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { api } from './api';
import { authApi, LoginRequest, LoginResponse } from './queries'; // Import LoginResponse from queries
import { queryKeys } from './queries';
import { useNavigate } from 'react-router-dom';

import type {
  OnboardingData,
  CreateUserData,
  UpdateUserData,
  CreateFacilityData,
  UpdateFacilityData,
} from '@/types';
import { useToast } from '@/hooks/use-toast';

export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
      queryClient.clear();
      navigate('/login', { replace: true });
    },
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
  });
}

export function useOnboardingMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: OnboardingData & { profilePictureFile?: File }) => {
      const formData = new FormData();
      if (data.profilePictureFile) {
        formData.append('profilePicture', data.profilePictureFile);
      }
      const { profilePictureFile, ...rest } = data;
      formData.append('data', JSON.stringify(rest));

      const response = await api.post('/onboarding', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data;
    },
    onSuccess: data => {
      toast({
        title: 'Account Created Successfully',
        description: 'Welcome to the Emergency Planning System!',
      });
      if (data?.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      navigate('/facility-setup');
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateUserData) => {
      const response = await api.post('/master/users', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserData }) => {
      const response = await api.put(`/master/users/${id}`, data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.byId(id) });
    },
  });
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/master/users/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

export function useCreateFacilityMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateFacilityData) => {
      const response = await api.post('/facilities', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.facilities.all });
    },
  });
}

export function useUpdateFacilityMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateFacilityData }) => {
      const response = await api.put(`/facilities/${id}`, data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.facilities.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.facilities.byId(id) });
    },
  });
}

export function useDeleteFacilityMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/facilities/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.facilities.all });
    },
  });
}

export function useAcceptInviteMutation(
  options?: UseMutationOptions<LoginResponse, Error, { token: string; password: string }>,
) {
  return useMutation<LoginResponse, Error, { token: string; password: string }>({
    mutationFn: (data: { token: string; password: string }) => authApi.acceptInvite(data),
    ...options,
  });
}

export function useResetPasswordMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: { token: string; password: string }) => authApi.resetPassword(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
      navigate('/login', { replace: true });
    },
  });
}

export function useValidateResetTokenMutation() {
  return useMutation({
    mutationFn: (token: string) => authApi.validateResetToken(token),
  });
}

export function useApiMutation<TData = unknown, TVariables = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  invalidateQueries?: string[][],
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      if (invalidateQueries) {
        invalidateQueries.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
    },
  });
}
