import { Organization } from '../models/organization.model';
import { User } from '../models/user.model';
import { Payment } from '../models/payment.model';
import { Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import { PlanTier, UserRole, InviteStatus } from '../enums/Enums';
import { OnboardingSuccessResponse } from '../types';
import { AdminInput, InvitedAdminInput, OnboardingInput } from '../models/onboarding.inputs';

export class OnboardingService {
  static async handleOnboarding(data: OnboardingInput): Promise<OnboardingSuccessResponse> {
    const { organization, admin, invitedAdmins, stripeSessionId } = data;

    const orgDoc = await Organization.create([{ ...organization }]);
    const org = orgDoc[0];

    const hashedPassword = await bcrypt.hash(admin.password, 10);
    const adminDoc = await User.create([
      {
        ...admin,
        password: hashedPassword,
        organizationId: org._id,
        role: UserRole.ADMIN,
        inviteStatus: InviteStatus.ACCEPTED,
      },
    ]);
    const adminUser = adminDoc[0];

    org.adminId = adminUser._id as Types.ObjectId;
    await org.save();

    let invitedAdminUsers: typeof adminDoc = [];
    if (invitedAdmins && invitedAdmins.length > 0) {
      invitedAdminUsers = await User.create(
        invitedAdmins.map((invitedAdmin: InvitedAdminInput) => ({
          ...invitedAdmin,
          organizationId: org._id,
          role: UserRole.ADMIN,
          inviteStatus: InviteStatus.PENDING,
        })),
      );
    }

    if (organization.selectedPlan !== PlanTier.FREE) {
      await Payment.create([
        {
          organizationId: org._id,
          userId: adminUser._id,
          plan: organization.selectedPlan,
          amount: 0,
          currency: 'usd',
          status: 'completed',
          stripeSessionId: stripeSessionId || '',
        },
      ]);
    }

    return { organization: org, owner: adminUser, invitedAdmins: invitedAdminUsers };
  }
}
