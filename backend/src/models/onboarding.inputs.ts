
export interface OrganizationInput {
  name: string;
  address: string;
  phoneNumber: string;
  industry: string;
  natureOfWork?: string;
  abn?: string;
  organizationSize: string;
  selectedPlan: 'free' | 'tier1' | 'tier2' | 'tier3' | 'enterprise';
  maxFacilities: number;
  totalSeats: number;
}

export interface OwnerInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface InvitedAdminInput {
  name: string;
  email: string;
  phone?: string;
}

export interface OnboardingInput {
  organization: OrganizationInput;
  owner: OwnerInput;
  invitedAdmins?: InvitedAdminInput[];
  stripeSessionId?: string;
} 