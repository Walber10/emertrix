import { Router } from 'express';
import authRouter from './auth.routes';
import masterAdminRouter from './master-admin.routes';
import { onboardingRouter } from './onboarding.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/master', masterAdminRouter);
router.use('/onboarding', onboardingRouter);

export default router;
