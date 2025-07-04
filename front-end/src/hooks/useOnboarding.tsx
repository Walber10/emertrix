import { useBackendHealth, useOnboardingMutation } from '../api/queries';

export interface OnboardingData {
  organization: {
    name: string;
    address: string;
    phoneNumber: string;
    industry: string;
    organizationSize: string;
    selectedPlan: string;
    natureOfWork?: string;
    abn?: string;
    maxFacilities: number;
    totalSeats: number;
  };
  owner: {
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

export interface OnboardingResponse {
  organization: {
    _id: string;
    name: string;
    address: string;
    phoneNumber: string;
    industry: string;
    organizationSize: string;
    selectedPlan: string;
    natureOfWork?: string;
    abn?: string;
    maxFacilities: number;
    totalSeats: number;
    ownerId?: string;
    createdAt: string;
  };
  owner: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    organizationId: string;
    role: string;
    inviteStatus: string;
    createdAt: string;
  };
  invitedAdmins: Array<{
    _id: string;
    name: string;
    email: string;
    phone?: string;
    organizationId: string;
    role: string;
    inviteStatus: string;
    createdAt: string;
  }>;
}

export function useTestBackend() {
  const { data, isLoading, error, isError } = useBackendHealth();
  
  return {
    status: isLoading ? 'loading' : isError ? 'error' : 'success',
    message: error ? error.message : typeof data === 'string' ? data : JSON.stringify(data),
  };
}

export function useOnboarding() {
  const mutation = useOnboardingMutation();
  
  return {
    submitOnboarding: mutation.mutate,
    loading: mutation.isPending,
    error: mutation.error?.message || null,
    success: mutation.data || null,
  };
}
