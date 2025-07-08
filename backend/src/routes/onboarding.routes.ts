import express, { Request, Response } from 'express';
import { OnboardingService } from '../services/onboarding.service';
import { onboardingSchema, OnboardingRequest } from '../schemas';
import { OnboardingSuccessResponse, OnboardingErrorResponse } from '../types';

const router = express.Router();

type OnboardingResponse = Response<
  { success: true; data: OnboardingSuccessResponse } | OnboardingErrorResponse
>;

router.post('/', async (req: Request<{}, {}, OnboardingRequest>, res: OnboardingResponse) => {
  const result = onboardingSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: result.error.errors.map(e => e.message).join(', '),
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
