import { prisma } from '../database/connectToDB';
import bcrypt from 'bcryptjs';
import { PlanTier, UserRole, InviteStatus, User } from '@prisma/client';
import { OnboardingSuccessResponse } from '../types';
import { OnboardingInput } from '../models/onboarding.inputs';
import { EmailService } from './email.service';
import { PaymentService } from './payment.service';
import crypto from 'crypto';

function generateInviteToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export class OnboardingService {
  static async handleOnboarding(
    data: OnboardingInput,
  ): Promise<OnboardingSuccessResponse & { checkoutUrl?: string }> {
    const { organization, admin, invitedAdmins } = data;

    const { billingInterval, ...orgData } = organization;
    const org = await prisma.organization.create({
      data: { ...orgData },
    });

    const hashedPassword = await bcrypt.hash(admin.password, 10);
    const adminUser = await prisma.user.create({
      data: {
        ...admin,
        password: hashedPassword,
        organizationId: org.id,
        role: UserRole.ADMIN,
        inviteStatus: InviteStatus.ACCEPTED,
      },
    });

    await prisma.organization.update({
      where: { id: org.id },
      data: { adminId: adminUser.id },
    });

    const invitedAdminUsers: User[] = [];
    if (invitedAdmins && invitedAdmins.length > 0) {
      const now = new Date();
      const expires = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

      for (const invitedAdmin of invitedAdmins) {
        const token = generateInviteToken();
        const invitedUser = await prisma.user.create({
          data: {
            name: invitedAdmin.name,
            email: invitedAdmin.email,
            phone: invitedAdmin.phone,
            profilePicture: invitedAdmin.profilePicture,
            organizationId: org.id,
            role: UserRole.ADMIN,
            inviteStatus: InviteStatus.PENDING,
            inviteToken: token,
            inviteTokenExpires: expires,
          },
        });
        invitedAdminUsers.push(invitedUser);

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
        const inviteLink = `${frontendUrl.replace(/\/$/, '')}/accept-invite?token=${token}`;
        await EmailService.sendEmail({
          to: invitedUser.email,
          subject: 'You have been invited as an admin to Emertrix',
          html: `<h2>Welcome to Emertrix!</h2><p>You have been invited as an admin for organization <b>${org.name}</b>.<br/>Click <a href="${inviteLink}">here</a> to accept your invite and set your password. This link will expire in 7 days.</p>`,
        });
      }
    }

    let checkoutUrl: string | undefined = undefined;
    if (organization.selectedPlan !== PlanTier.FREE) {
      const { selectedPlan, billingInterval } = organization;
      const priceId = process.env[`STRIPE_PRICE_ID_${selectedPlan}_${billingInterval}`];
      if (!priceId) {
        throw new Error(`Stripe price ID not configured for plan: ${organization.selectedPlan}`);
      }
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
      const session = await PaymentService.createCheckoutSession({
        priceId,
        customerEmail: adminUser.email,
        successUrl: `${frontendUrl}/payment-success`,
        cancelUrl: `${frontendUrl}/payment-failed`,
      });
      await prisma.payment.create({
        data: {
          organizationId: org.id,
          userId: adminUser.id,
          plan: organization.selectedPlan,
          amount: 0,
          currency: 'aud',
          status: 'PENDING',
          stripeSessionId: session.id,
        },
      });
      checkoutUrl = session.url!;
    }

    return { organization: org, admin: adminUser, invitedAdmins: invitedAdminUsers, checkoutUrl };
  }
}
