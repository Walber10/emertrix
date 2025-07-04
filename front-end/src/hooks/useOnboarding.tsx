import { useState } from 'react';

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
  organization: any;
  owner: any;
  invitedAdmins: any[];
}

export function useOnboarding() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<OnboardingResponse | null>(null);

  const submitOnboarding = async (data: OnboardingData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Onboarding failed');
      }
      const result = await response.json();
      setSuccess(result);
      return result;
    } catch (err: any) {
      setError(err.message || 'Onboarding failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submitOnboarding, loading, error, success };
}
