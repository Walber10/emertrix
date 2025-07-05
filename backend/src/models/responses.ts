import { IOrganization } from './Organization';
import { IUser } from './User';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface OnboardingSuccessResponse {
  organization: IOrganization;
  owner: IUser;
  invitedAdmins: IUser[];
}

export interface UserResponse {
  user: IUser;
}

export interface OrganizationResponse {
  organization: IOrganization;
}

export interface OrganizationsResponse {
  organizations: IOrganization[];
}
