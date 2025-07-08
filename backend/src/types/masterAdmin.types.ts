export interface OrganizationWithUserCount {
  _id: any;
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
  adminId?: any;
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
