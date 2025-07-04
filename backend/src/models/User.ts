import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  organizationId: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  role: 'owner' | 'admin' | 'point-of-contact' | 'occupant';
  inviteStatus: 'pending' | 'accepted';
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  role: { type: String, enum: ['owner', 'admin', 'point-of-contact', 'occupant'], required: true },
  inviteStatus: { type: String, enum: ['pending', 'accepted'], default: 'accepted' },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model<IUser>("User", UserSchema); 