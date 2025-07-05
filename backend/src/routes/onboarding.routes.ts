import express, { Request, Response } from 'express';
import { z } from 'zod';
import { PlanTier } from '../enums/Enums';
import { OnboardingService } from '../services/onboarding.service';
import { ApiResponse, OnboardingSuccessResponse } from '../models/responses';

const router = express.Router();

const onboardingSchema = z.object({
  organization: z.object({
    name: z.string().min(1, 'Organization name is required'),
    address: z.string().min(1, 'Organization address is required'),
    phoneNumber: z.string().min(1, 'Phone number is required'),
    industry: z.string().min(1, 'Industry is required'),
    organizationSize: z.string().min(1, 'Organization size is required'),
    selectedPlan: z.enum(
      [PlanTier.FREE, PlanTier.TIER1, PlanTier.TIER2, PlanTier.TIER3, PlanTier.ENTERPRISE],
      { required_error: 'Plan selection is required' },
    ),
    natureOfWork: z.string().optional(),
    abn: z.string().optional(),
    maxFacilities: z.number({ required_error: 'Maximum facilities count is required' }),
    totalSeats: z.number({ required_error: 'Total seats count is required' }),
  }),
  owner: z.object({
    name: z.string().min(1, 'Owner name is required'),
    email: z.string().email('Please provide a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    phone: z.string().optional(),
  }),
  invitedAdmins: z
    .array(
      z.object({
        name: z.string().min(1, 'Admin name is required'),
        email: z.string().email('Please provide a valid email address'),
        phone: z.string().optional(),
      }),
    )
    .optional(),
  stripeSessionId: z.string().optional(),
});

type OnboardingResponse = Response<ApiResponse<OnboardingSuccessResponse>>;

type OnboardingBody = z.infer<typeof onboardingSchema>;

router.post('/', async (req: Request<{}, {}, OnboardingBody>, res: OnboardingResponse) => {
  const result = onboardingSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: result.error.errors.map(e => e.message).join(', '),
    });
  }
  try {
    const response = await OnboardingService.handleOnboarding(result.data);
    res.status(201).json({ success: true, data: response });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : String(err),
    });
  }
});

export { router as onboardingRouter };
