import { useOnboardingMutation } from '@/api';
import { useBackendHealth } from '../api/queries';
import { PlanTier } from '@/types';
import { useState } from 'react';

export interface OnboardingData {
  organization: {
    name: string;
    address: string;
    phoneNumber: string;
    industry: string;
    organizationSize: string;
    selectedPlan: PlanTier;
    billingInterval: 'MONTHLY' | 'YEARLY';
    natureOfWork?: string;
    abn?: string;
    maxFacilities: number;
    totalSeats: number;
  };
  admin: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  };
  invitedAdmins?: {
    name: string;
    email: string;
    phone?: string;
  }[];
  stripeSessionId?: string;
}

export function useTestBackend() {
  const { data, isLoading, error, isError } = useBackendHealth();

  return {
    status: isLoading ? 'loading' : isError ? 'error' : 'success',
    message: error ? error.message : typeof data === 'string' ? data : JSON.stringify(data),
  };
}

export const useOnboarding = () => {
  const mutation = useOnboardingMutation();

  return {
    submitOnboarding: mutation.mutate,
    loading: mutation.isPending,
    error: mutation.error?.message || null,
    success: mutation.data || null,
  };
};
