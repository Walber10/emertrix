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

export interface AdminInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  profilePicture?: string;
}

export interface InvitedAdminInput {
  name: string;
  email: string;
  phone?: string;
  profilePicture?: string;
}

export interface OnboardingInput {
  organization: OrganizationInput;
  admin: AdminInput;
  invitedAdmins?: InvitedAdminInput[];
  stripeSessionId?: string;
}
