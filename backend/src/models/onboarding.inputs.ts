import { PlanTier } from '@prisma/client';

export interface OrganizationInput {
  name: string;
  address: string;
  phoneNumber: string;
  industry: string;
  natureOfWork?: string;
  abn?: string;
  organizationSize: string;
  selectedPlan: PlanTier;
  billingInterval: 'MONTHLY' | 'YEARLY';
  maxFacilities: number;
  totalSeats: number;
}

export interface AdminInput {
  name: string;
  email: string;
  password: string;
  phone?: string | null;
  profilePicture?: string | null;
}

export interface InvitedAdminInput {
  name: string;
  email: string;
  phone?: string | null;
  profilePicture?: string | null;
}

export interface OnboardingInput {
  organization: OrganizationInput;
  admin: AdminInput;
  invitedAdmins?: InvitedAdminInput[];
  stripeSessionId?: string;
}
