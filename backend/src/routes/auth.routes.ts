import express, { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { setAuthCookie, generateToken } from '../configuration/auth';
import { isAuth } from '../middleware/isAuth';
import { loginSchema, forgotPasswordSchema, LoginRequest, ForgotPasswordRequest } from '../schemas';
import {
  LoginResponse,
  LoginErrorResponse,
  ForgotPasswordResponse,
  ForgotPasswordErrorResponse,
  MeResponse,
  MeErrorResponse,
  SafeUser,
} from '../types';
import { InviteStatus } from '@prisma/client';
import { prisma } from '../database/connectToDB';
import bcrypt from 'bcryptjs';

const router = express.Router();

function userToSafeObject(user: any): SafeUser {
  return {
    _id: user.id,
    organizationId: user.organizationId,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isPointOfContact: user.isPointOfContact,
    inviteStatus: user.inviteStatus,
    createdAt: user.createdAt,
    profilePicture: user?.profilePicture,
  };
}

router.post(
  '/login',
  async (req: Request<{}, {}, LoginRequest>, res: Response<LoginResponse | LoginErrorResponse>) => {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error.errors.map(e => e.message).join(', '),
      });
    }

    const { email, password } = result.data;
    try {
      const { user, token } = await AuthService.login(email, password);
      setAuthCookie(res, token);
      const userObj = userToSafeObject(user);
      res.json({ success: true, user: userObj });
    } catch (err) {
      res
        .status(401)
        .json({ success: false, error: err instanceof Error ? err.message : 'Login failed' });
    }
  },
);

router.post(
  '/forgot-password',
  async (
    req: Request<{}, {}, ForgotPasswordRequest>,
    res: Response<ForgotPasswordResponse | ForgotPasswordErrorResponse>,
  ) => {
    const result = forgotPasswordSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error.errors.map(e => e.message).join(', '),
      });
    }

    const { email } = result.data;
    try {
      const result = await AuthService.forgotPassword(email);
      res.json({ success: true, ...result });
    } catch (err) {
      res.status(404).json({ success: false, error: err instanceof Error ? err.message : 'Error' });
    }
  },
);

router.post(
  '/accept-invite',
  async (
    req: Request<{}, {}, { token: string; password: string }>,
    res: Response<LoginResponse | LoginErrorResponse>,
  ) => {
    const { token, password } = req.body;
    if (!token || !password || password.length < 6) {
      return res
        .status(400)
        .json({ success: false, error: 'Token and valid password are required.' });
    }

    const user = await prisma.user.findUnique({
      where: { inviteToken: token },
    });

    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid or expired invite token.' });
    }

    if (!user.inviteTokenExpires || user.inviteTokenExpires < new Date()) {
      return res.status(400).json({ success: false, error: 'Invite token has expired.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        inviteStatus: InviteStatus.ACCEPTED,
        inviteToken: null,
        inviteTokenExpires: null,
      },
    });

    const tokenStr = generateToken(updatedUser.id);
    setAuthCookie(res, tokenStr);
    res.json({ success: true, user: userToSafeObject(updatedUser) });
  },
);

router.get('/me', isAuth, (req: Request, res: Response<MeResponse | MeErrorResponse>) => {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ success: false, error: 'Not authenticated' });
  res.json({ success: true, user: userToSafeObject(user) });
});

router.get(
  '/validate-reset-token/:token',
  async (
    req: Request<{ token: string }>,
    res: Response<{ valid: boolean; email?: string } | { error: string }>,
  ) => {
    const { token } = req.params;

    try {
      const user = await prisma.user.findUnique({
        where: { passwordResetToken: token },
      });

      if (!user) {
        return res.json({ valid: false });
      }

      if (!user.passwordResetExpires || user.passwordResetExpires < new Date()) {
        return res.json({ valid: false });
      }

      res.json({ valid: true, email: user.email });
    } catch (error) {
      res.status(500).json({ error: 'Failed to validate token' });
    }
  },
);

router.post(
  '/reset-password',
  async (
    req: Request<{}, {}, { token: string; password: string }>,
    res: Response<{ success: boolean; message?: string } | { error: string }>,
  ) => {
    const { token, password } = req.body;

    if (!token || !password || password.length < 6) {
      return res.status(400).json({ error: 'Token and valid password are required.' });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { passwordResetToken: token },
      });

      if (!user) {
        return res.status(400).json({ error: 'Invalid or expired reset token.' });
      }

      if (!user.passwordResetExpires || user.passwordResetExpires < new Date()) {
        return res.status(400).json({ error: 'Reset token has expired.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          passwordResetToken: null,
          passwordResetExpires: null,
        },
      });

      res.json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to reset password' });
    }
  },
);

router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
  res.json({ success: true });
});

export default router;
