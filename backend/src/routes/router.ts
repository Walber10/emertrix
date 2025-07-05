import { Router } from 'express';
import { onboardingRouter } from './onboarding.routes';
export const router = Router();

router.use('/onboarding', onboardingRouter);
