import mongoose, { Schema, Document, Types } from 'mongoose';

export enum FacilityAccessLevel {
  MANAGER = 'manager',
  VIEWER = 'viewer',
}

export interface IFacilityAccess extends Document {
  userId: Types.ObjectId;
  facilityId: Types.ObjectId;
  accessLevel: FacilityAccessLevel;
  isPointOfContact: boolean;
}

const FacilityAccessSchema = new Schema<IFacilityAccess>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  facilityId: { type: Schema.Types.ObjectId, ref: 'Facility', required: true },
  accessLevel: { type: String, enum: Object.values(FacilityAccessLevel), required: true },
  isPointOfContact: { type: Boolean, default: false },
});

export const FacilityAccess = mongoose.model<IFacilityAccess>(
  'FacilityAccess',
  FacilityAccessSchema,
);
