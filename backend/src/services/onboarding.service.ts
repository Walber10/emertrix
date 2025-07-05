import { Organization } from '../models/Organization';
import { User } from '../models/User';
import { Payment } from '../models/Payment';
import { Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import { PlanTier, UserRole, InviteStatus } from '../enums/Enums';
import mongoose from 'mongoose';
import { OnboardingSuccessResponse } from '../models/responses';
import { withTransaction } from '../utils/transaction';
import { InvitedAdminInput, OnboardingInput } from '../models/onboarding.inputs';

export class OnboardingService {
  static async handleOnboarding(data: OnboardingInput): Promise<OnboardingSuccessResponse> {
    const { organization, owner, invitedAdmins, stripeSessionId } = data;
    return withTransaction(async session => {
      const orgDoc = await Organization.create([{ ...organization }], { session });
      const org = orgDoc[0];
      const hashedPassword = await bcrypt.hash(owner.password, 10);

      const ownerDoc = await User.create(
        [
          {
            ...owner,
            password: hashedPassword,
            organizationId: org._id,
            role: UserRole.OWNER,
            inviteStatus: InviteStatus.ACCEPTED,
          },
        ],
        { session },
      );
      const ownerUser = ownerDoc[0];

      org.ownerId = ownerUser._id as Types.ObjectId;
      await org.save({ session });

      let adminUsers: typeof ownerDoc = [];
      if (invitedAdmins && invitedAdmins.length > 0) {
        adminUsers = await User.create(
          invitedAdmins.map((admin: InvitedAdminInput) => ({
            ...admin,
            organizationId: org._id,
            role: UserRole.ADMIN,
            inviteStatus: InviteStatus.PENDING,
          })),
          { session },
        );
      }

      if (organization.selectedPlan !== PlanTier.FREE) {
        await Payment.create(
          [
            {
              organizationId: org._id,
              userId: ownerUser._id,
              plan: organization.selectedPlan,
              amount: 0, // TODO: set actual amount
              currency: 'usd', // TODO: set actual currency
              status: 'completed', // TODO: set based on Stripe
              stripeSessionId: stripeSessionId || '',
            },
          ],
          { session },
        );
      }

      return { organization: org, owner: ownerUser, invitedAdmins: adminUsers };
    });
  }
}
