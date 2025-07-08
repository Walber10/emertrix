import { IOrganization } from '../models/organization.model';
import { IUser } from '../models/user.model';

export interface OnboardingSuccessResponse {
  organization: IOrganization;
  owner: IUser;
  invitedAdmins: IUser[];
}

export interface OnboardingErrorResponse {
  success: false;
  message: string;
}
