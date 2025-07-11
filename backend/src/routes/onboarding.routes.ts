import express, { Request, Response } from 'express';
import multer from 'multer';
import { OnboardingService } from '../services/onboarding.service';
import { onboardingSchema, OnboardingRequest } from '../schemas';
import { OnboardingSuccessResponse, OnboardingErrorResponse } from '../types';
import { uploadToS3 } from '../services/upload.service';
import { AuthService } from '../services/auth.service';
import { setAuthCookie } from '../configuration/auth';
import { prisma } from '../database/connectToDB';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

type MulterRequest = Request & { file?: Express.Multer.File };

type OnboardingResponse = Response<
  { success: true; data: OnboardingSuccessResponse } | OnboardingErrorResponse
>;

router.post(
  '/',
  upload.single('profilePicture'),
  async (req: MulterRequest, res: OnboardingResponse) => {
    let onboardingData: OnboardingRequest;
    try {
      onboardingData = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body;
    } catch (err) {
      return res.status(400).json({ success: false, message: 'Invalid onboarding data' });
    }

    const result = onboardingSchema.safeParse(onboardingData);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error.errors.map(e => e.message).join(', '),
      });
    }

    try {
      const response = await OnboardingService.handleOnboarding(result.data);

      const { admin } = response;
      const originalPassword = result.data.admin.password;
      const { user, token } = await AuthService.login(admin.email, originalPassword);
      setAuthCookie(res, token);

      if (req.file && response.admin?.id) {
        const url = await uploadToS3(
          req.file.buffer,
          req.file.originalname,
          'profile-pictures',
          req.file.mimetype,
        );
        await prisma.user.update({
          where: { id: response.admin.id },
          data: { profilePicture: url },
        });
        response.admin.profilePicture = url;
      }

      res.status(201).json({ success: true, data: response });
    } catch (err) {
      console.error('Onboarding error:', err);

      const errorMessage = err instanceof Error ? err.message : String(err);

      if (errorMessage.includes('already exists') || errorMessage.includes('already in use')) {
        return res.status(409).json({
          success: false,
          message: errorMessage,
        });
      }

      if (errorMessage.includes('Unique constraint failed')) {
        return res.status(409).json({
          success: false,
          message:
            'A user with this email already exists. Please use a different email or login to your existing account.',
        });
      }

      res.status(500).json({
        success: false,
        message: 'An error occurred during account setup. Please try again.',
      });
    }
  },
);

export { router as onboardingRouter };
