

// Core Types matching MongoDB schema structure

export interface Organization {
  _id: string;
  name: string;
  address: string;
  phoneNumber: string;
  industry: string;
  natureOfWork?: string;
  abn?: string;
  organizationSize: string;
  selectedPlan: 'tier1' | 'tier2' | 'tier3' | 'enterprise';
  maxFacilities: number;
  totalSeats: number;
  createdAt: Date;
}

export interface User {
  _id: string;
  organizationId: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'point-of-contact' | 'occupant';
  facilityIds: string[]; // Assigned facilities
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
  _id: string;
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
  pointOfContactId: string; // User ID
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
  procedureIds: string[]; // References to EmergencyProcedures
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
  participants: string[]; // User IDs
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
  participants: string[]; // User IDs
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

