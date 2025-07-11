import { Router } from 'express';
import authRouter from './auth.routes';
import masterAdminRouter from './master-admin.routes';
import { onboardingRouter } from './onboarding.routes';
import { organizationsRouter } from './organization.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/master', masterAdminRouter);
router.use('/onboarding', onboardingRouter);
router.use('/organizations', organizationsRouter);

export default router;
