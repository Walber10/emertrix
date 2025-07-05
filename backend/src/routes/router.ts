import { Router } from 'express';
import { onboardingRouter } from './onboarding.routes';
export const router = Router();
router.get('/', (req, res) => {
  res.send('Backend API is running!');
});
router.use('/onboarding', onboardingRouter);
