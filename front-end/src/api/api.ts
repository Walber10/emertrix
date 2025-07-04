export async function submitOnboarding(data: any) {
    const response = await fetch('/api/onboarding', {
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