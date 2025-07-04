import type { OnboardingData } from '../hooks/useOnboarding';

const API_URL = import.meta.env.VITE_API_URL || '';

export async function pingBackend() {
  const response = await fetch(`${API_URL}/api/`);
  if (!response.ok) {
    throw new Error('Backend not reachable');
  }
  return response.json();
}

export async function submitOnboarding(data: OnboardingData) {
  const response = await fetch(`${API_URL}/api/onboarding`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.message || 'Onboarding failed');
  }
  return response.json();
}