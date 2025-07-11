import { useState, useCallback } from 'react';
import { OnboardingState, OnboardingStep, PlanSelection } from '@/types/onboarding';

const ONBOARDING_KEY = 'emertrix-onboarding-v1';

const getInitialOnboardingState = (): OnboardingState => ({
  plan: null,
  organization: null,
  account: null,
  facilities: [],
  currentStep: 'plan-selection',
});

const getPlanLimits = (tier: string): { seats: number; facilities: number } => {
  switch (tier) {
    case 'tier1':
      return { seats: 50, facilities: 1 };
    case 'tier2':
      return { seats: 100, facilities: 1 };
    case 'tier3':
      return { seats: 300, facilities: 2 };
    case 'enterprise':
      return { seats: 500, facilities: 5 };
    default:
      return { seats: 0, facilities: 0 };
  }
};

export const useOnboardingState = () => {
  const [state, setState] = useState<OnboardingState>(() => {
    try {
      const stored = localStorage.getItem(ONBOARDING_KEY);
      return stored ? JSON.parse(stored) : getInitialOnboardingState();
    } catch {
      return getInitialOnboardingState();
    }
  });

  const updateState = useCallback(
    (updates: Partial<OnboardingState>) => {
      const newState = { ...state, ...updates };
      setState(newState);
      localStorage.setItem(ONBOARDING_KEY, JSON.stringify(newState));
    },
    [state],
  );

  const setPlan = useCallback(
    (tier: string, billing: 'monthly' | 'annual' = 'annual') => {
      const limits = getPlanLimits(tier);
      const plan: PlanSelection = {
        tier: tier as 'tier1' | 'tier2' | 'tier3' | 'enterprise',
        seats: limits.seats,
        facilities: limits.facilities,
        billing,
      };
      updateState({ plan, currentStep: 'account-setup' });
    },
    [updateState],
  );

  const setCurrentStep = useCallback(
    (step: OnboardingStep) => {
      updateState({ currentStep: step });
    },
    [updateState],
  );

  const clearOnboarding = useCallback(() => {
    localStorage.removeItem(ONBOARDING_KEY);
    setState(getInitialOnboardingState());
  }, []);

  const getSelectedPlanLimits = useCallback(() => {
    if (!state.plan) return { seats: 0, facilities: 0 };
    return { seats: state.plan.seats, facilities: state.plan.facilities };
  }, [state.plan]);

  return {
    onboarding: state,
    updateState,
    setPlan,
    setCurrentStep,
    clearOnboarding,
    getSelectedPlanLimits,
  };
};
