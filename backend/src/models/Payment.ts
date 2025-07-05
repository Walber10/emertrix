import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPayment extends Document {
  organizationId: Types.ObjectId;
  userId: Types.ObjectId;
  plan: 'free' | 'tier1' | 'tier2' | 'tier3' | 'enterprise';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  stripeSessionId?: string;
  createdAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: String, enum: ['free', 'tier1', 'tier2', 'tier3', 'enterprise'], required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], required: true },
  stripeSessionId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
