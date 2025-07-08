import { UserRole, InviteStatus } from '../models/user.model';

export interface SafeUser {
  _id: string;
  organizationId: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isPointOfContact: boolean;
  inviteStatus: InviteStatus;
  profilePicture?: string;
  createdAt: Date;
}

export interface LoginResponse {
  success: true;
  user: SafeUser;
}

export interface LoginErrorResponse {
  success: false;
  error: string;
}

export interface ForgotPasswordResponse {
  success: true;
  message: string;
}

export interface ForgotPasswordErrorResponse {
  success: false;
  error: string;
}

export interface MeResponse {
  success: true;
  user: SafeUser;
}

export interface MeErrorResponse {
  success: false;
  error: string;
}
