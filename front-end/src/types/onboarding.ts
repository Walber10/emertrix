export type OnboardingStep =
  | 'plan-selection'
  | 'account-setup'
  | 'organization-setup'
  | 'facility-setup'
  | 'complete';

export interface PlanSelection {
  tier: 'tier1' | 'tier2' | 'tier3' | 'enterprise';
  seats: number;
  facilities: number;
  billing: 'monthly' | 'annual';
}

export interface OrganizationDraft {
  name: string;
  address: string;
  phoneNumber: string;
  industry: string;
  natureOfWork?: string;
  abn?: string;
  organizationSize: string;
}

export interface AccountDraft {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface FacilityDraft {
  name: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  phoneNumber?: string;
  email?: string;
  maxOccupancy?: number;
  facilityType?: string;
  pointOfContactId?: string;
  assignedOccupantIds?: string[];
  microsites?: Array<{
    id: string;
    name: string;
    address: string;
    type?: string;
    epcRepresentative?: string;
    occupants?: string[];
  }>;
}

export interface OnboardingState {
  plan: PlanSelection | null;
  organization: OrganizationDraft | null;
  account: AccountDraft | null;
  facilities: FacilityDraft[];
  currentStep: OnboardingStep;
}
