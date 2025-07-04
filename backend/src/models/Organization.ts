import mongoose, { Schema, Document, Types } from "mongoose";

export interface IOrganization extends Document {
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
  ownerId?: Types.ObjectId;
  createdAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  industry: { type: String, required: true },
  natureOfWork: { type: String },
  abn: { type: String },
  organizationSize: { type: String, required: true },
  selectedPlan: { type: String, enum: ['free', 'tier1', 'tier2', 'tier3', 'enterprise'], required: true },
  maxFacilities: { type: Number, required: true },
  totalSeats: { type: Number, required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

export const Organization = mongoose.model<IOrganization>("Organization", OrganizationSchema); 