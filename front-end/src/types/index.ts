export enum PlanTier {
  FREE = 'FREE',
  TIER1 = 'TIER1',
  TIER2 = 'TIER2',
  TIER3 = 'TIER3',
  ENTERPRISE = 'ENTERPRISE',
}

export enum UserRole {
  MASTER = 'MASTER',
  ADMIN = 'ADMIN',
  OCCUPANT = 'OCCUPANT',
}

export enum InviteStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
}

export const mapPlanToEnum = (plan: string): PlanTier => {
  const planMap: Record<string, PlanTier> = {
    free: PlanTier.FREE,
    tier1: PlanTier.TIER1,
    tier2: PlanTier.TIER2,
    tier3: PlanTier.TIER3,
    enterprise: PlanTier.ENTERPRISE,
  };
  return planMap[plan.toLowerCase()] || PlanTier.TIER1;
};

// ============================================
// IMPORT AUTH TYPES FROM QUERIES (avoid duplication)
// ============================================
export type { LoginRequest, LoginResponse, User as QueryUser } from '@/api/queries';

// ============================================
// ENTITY TYPES (Full objects from database)
// ============================================

export interface Organization {
  id: string; // Standardized to 'id' instead of '_id'
  name: string;
  address: string;
  phoneNumber: string;
  industry: string;
  natureOfWork?: string;
  abn?: string;
  organizationSize: string;
  selectedPlan: PlanTier;
  maxFacilities: number;
  totalSeats: number;
  adminId?: string;
  createdAt: Date;
}

export interface User {
  id: string; // Standardized to 'id' instead of '_id'
  organizationId?: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: UserRole;
  isPointOfContact?: boolean;
  inviteStatus?: InviteStatus;
  facilityIds?: string[];
  profilePicture?: string;
  createdAt: Date;
}

export interface Microsite {
  id: string;
  name: string;
  address: string;
  type?: string;
  epcRepresentative?: string;
  occupants?: string[];
}

export interface Facility {
  id: string; // Standardized to 'id' instead of '_id'
  organizationId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  phoneNumber: string;
  email?: string;
  maxOccupancy?: number;
  facilityType: string;
  pointOfContactId: string;
  assignedOccupantIds: string[];
  microsites: Microsite[];
  createdAt: Date;
}

export interface RiskAssessment {
  hazards: string[];
  notes?: string;
}

export interface EmergencyPlan {
  _id: string;
  facilityId: string;
  procedureIds: string[];
  riskAssessment: RiskAssessment;
  createdAt: Date;
}

export interface EmergencyProcedure {
  _id: string;
  title: string;
  description?: string;
  steps?: string[];
  createdAt: Date;
}

export interface TrainingCourse {
  _id: string;
  organizationId: string;
  facilityId: string;
  courseType: string;
  organiserName: string;
  participants: string[];
  status: 'scheduled' | 'in-progress' | 'completed';
  scheduledDate?: Date;
  createdAt: Date;
}

export interface Exercise {
  _id: string;
  facilityId: string;
  exerciseType: string;
  objectives?: string;
  selectedProcedureId?: string;
  proposedDate: Date;
  proposedTime: string;
  location: string;
  coordinator: string;
  status: 'scheduled' | 'completed';
  createdAt: Date;
}

export interface ExerciseReview {
  _id: string;
  exerciseId: string;
  completed: boolean;
  dateCompleted?: Date;
  participants: string[];
  reviewer: string;
  observations: string;
  emailSummaryTo?: string;
  createdAt: Date;
}

export interface CommitteeMember {
  userId: string;
  role: string;
  responsibilities?: string;
}

export interface EmergencyCommittee {
  _id: string;
  facilityId: string;
  members: CommitteeMember[];
}

export interface EmergencyControlOrganization {
  _id: string;
  facilityId: string;
  controlHierarchy: string[];
}
// ============================================
// DTO TYPES (For API requests/responses)
// ============================================

export interface CreateOrganizationData {
  name: string;
  address: string;
  phoneNumber: string;
  industry: string;
  natureOfWork?: string;
  abn?: string;
  organizationSize: string;
  selectedPlan: PlanTier;
  maxFacilities: number;
  totalSeats: number;
}

export interface CreateUserData {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: UserRole;
  isPointOfContact?: boolean;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string;
  role?: UserRole;
  isPointOfContact?: boolean;
}

export interface CreateFacilityData {
  name: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  phoneNumber: string;
  email?: string;
  maxOccupancy?: number;
  facilityType: string;
  pointOfContactId: string;
  organizationId: string;
}

export interface UpdateFacilityData {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
  phoneNumber?: string;
  email?: string;
  maxOccupancy?: number;
  facilityType?: string;
  pointOfContactId?: string;
}

// ============================================
// ONBOARDING TYPES
// ============================================

export interface OnboardingData {
  organization: CreateOrganizationData;
  admin: CreateUserData;
  invitedAdmins?: CreateUserData[];
  stripeSessionId?: string;
}

// ============================================
// UI/COMPONENT TYPES
// ============================================

// Account Setup form state
export interface AccountSetupData {
  organizationName: string;
  organizationType: string;
  industry: string;
  natureOfWork: string;
  abn: string;
  organizationSize: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  phone: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  jobTitle: string;
  userPhone: string;
  profilePicture?: string;
  username: string;
}

// Invited admin UI state (before conversion to CreateUserData)
export interface InvitedAdmin {
  id: string; // UI-only for React keys
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
}
