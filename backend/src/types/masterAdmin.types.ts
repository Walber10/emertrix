import { PlanTier } from '@prisma/client';

export interface OrganizationWithUserCount {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  industry: string;
  natureOfWork?: string | null;
  abn?: string | null;
  organizationSize: string;
  selectedPlan: PlanTier;
  maxFacilities: number;
  totalSeats: number;
  adminId?: string | null;
  createdAt: Date;
  userCount: number;
}

export interface GetOrganizationsResponse {
  success: true;
  organizations: OrganizationWithUserCount[];
}

export interface GetOrganizationsErrorResponse {
  success: false;
  error: string;
}
