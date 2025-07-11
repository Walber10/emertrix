import { z } from 'zod';
import { PlanTier } from '../enums/Enums';

export const onboardingSchema = z.object({
  organization: z.object({
    name: z
      .string({ required_error: 'Organization name is required' })
      .min(1, 'Organization name is required'),
    address: z
      .string({ required_error: 'Organization address is required' })
      .min(1, 'Organization address is required'),
    phoneNumber: z
      .string({ required_error: 'Phone number is required' })
      .min(1, 'Phone number is required'),
    industry: z.string({ required_error: 'Industry is required' }).min(1, 'Industry is required'),
    organizationSize: z
      .string({ required_error: 'Organization size is required' })
      .min(1, 'Organization size is required'),
    selectedPlan: z.enum(
      [PlanTier.FREE, PlanTier.TIER1, PlanTier.TIER2, PlanTier.TIER3, PlanTier.ENTERPRISE],
      { required_error: 'Plan selection is required' },
    ),
    billingInterval: z.enum(['MONTHLY', 'YEARLY'], {
      required_error: 'Billing interval is required',
    }),
    natureOfWork: z.string().optional(),
    abn: z.string().optional(),
    maxFacilities: z.number({ required_error: 'Maximum facilities count is required' }),
    totalSeats: z.number({ required_error: 'Total seats count is required' }),
  }),
  admin: z.object({
    name: z.string({ required_error: 'Admin name is required' }).min(1, 'Admin name is required'),
    email: z
      .string({ required_error: 'Please provide a valid email address' })
      .email('Please provide a valid email address'),
    password: z
      .string({ required_error: 'Password must be at least 6 characters long' })
      .min(6, 'Password must be at least 6 characters long'),
    phone: z.string().optional(),
    profilePicture: z.string().optional(),
  }),
  invitedAdmins: z
    .array(
      z.object({
        name: z
          .string({ required_error: 'Admin name is required' })
          .min(1, 'Admin name is required'),
        email: z
          .string({ required_error: 'Please provide a valid email address' })
          .email('Please provide a valid email address'),
        phone: z.string().optional(),
        profilePicture: z.string().optional(),
      }),
    )
    .optional(),
  stripeSessionId: z.string().optional(),
});

export type OnboardingRequest = z.infer<typeof onboardingSchema>;
