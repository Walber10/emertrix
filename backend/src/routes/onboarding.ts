import express, { Request, Response } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import { Organization } from '../models/Organization';
import { User } from '../models/User';
import { Payment } from '../models/Payment';
import { Types } from 'mongoose';
import { PlanTier, UserRole, InviteStatus } from '../enums/Enums';
import bcrypt from 'bcryptjs';
import { IOrganization } from '../models/Organization';
import { IUser } from '../models/User';



const router = express.Router();

const onboardingSchema = z.object({
  organization: z.object({
    name: z.string().min(1),
    address: z.string().min(1),
    phoneNumber: z.string().min(1),
    industry: z.string().min(1),
    organizationSize: z.string().min(1),
    selectedPlan: z.enum([
      PlanTier.FREE,
      PlanTier.TIER1,
      PlanTier.TIER2,
      PlanTier.TIER3,
      PlanTier.ENTERPRISE,
    ]),
    natureOfWork: z.string().optional(),
    abn: z.string().optional(),
    maxFacilities: z.number(),
    totalSeats: z.number(),
  }),
  owner: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string().optional(),
  }),
  invitedAdmins: z.array(
    z.object({
      name: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional(),
    })
  ).optional(),
  stripeSessionId: z.string().optional(),
});

interface OnboardingSuccessResponse {
  organization: IOrganization;
  owner: IUser;
  invitedAdmins: IUser[];
}

type OnboardingBody = z.infer<typeof onboardingSchema>;

router.post(
  '/',
  async (req: Request<{}, {}, OnboardingBody>, res: Response) => {
    const result = onboardingSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.errors });
    }
    const { organization, owner, invitedAdmins, stripeSessionId } = result.data;

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const orgDoc = await Organization.create([{ ...organization }], { session });
      const org = orgDoc[0];
      const hashedPassword = await bcrypt.hash(owner.password, 10);

      const ownerDoc = await User.create([
        {
          ...owner,
          password: hashedPassword,
          organizationId: org._id,
          role: UserRole.OWNER,
          inviteStatus: InviteStatus.ACCEPTED,
        },
      ], { session });
      const ownerUser = ownerDoc[0];

      org.ownerId = ownerUser._id as Types.ObjectId;
      await org.save({ session });

      let adminUsers: typeof ownerDoc = [];
      if (invitedAdmins && invitedAdmins.length > 0) {
        adminUsers = await User.create(
          invitedAdmins.map((admin: any) => ({
            ...admin,
            organizationId: org._id,
            role: UserRole.ADMIN,
            inviteStatus: InviteStatus.PENDING,
          })),
          { session }
        );
      }

      if (organization.selectedPlan !== PlanTier.FREE) {
        await Payment.create([
          {
            organizationId: org._id,
            userId: ownerUser._id,
            plan: organization.selectedPlan,
            amount: 0, // TODO: set actual amount
            currency: 'usd', // TODO: set actual currency
            status: 'completed', // TODO: set based on Stripe
            stripeSessionId: stripeSessionId || '',
          },
        ], { session });
      }

      await session.commitTransaction();
      res.status(201).json({ organization: org, owner: ownerUser, invitedAdmins: adminUsers });
    } catch (err) {
      await session.abortTransaction();
      res.status(500).json({ message: err instanceof Error ? err.message : String(err) });
    } finally {
      session.endSession();
    }
  }
);

export { router as onboardingRouter }; 