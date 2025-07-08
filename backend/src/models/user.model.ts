import mongoose, { Schema, Document, Types } from 'mongoose';

export enum UserRole {
  MASTER = 'master',
  ADMIN = 'admin',
  OCCUPANT = 'occupant',
}

export enum InviteStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
}

export interface IUser extends Document {
  organizationId?: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  isPointOfContact: boolean;
  inviteStatus: InviteStatus;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(UserRole), required: true },
  isPointOfContact: { type: Boolean, default: false },
  inviteStatus: { type: String, enum: Object.values(InviteStatus), default: InviteStatus.ACCEPTED },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model<IUser>('User', UserSchema);
