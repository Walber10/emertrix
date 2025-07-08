import express, { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { setAuthCookie } from '../configuration/auth';
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

const router = express.Router();

function userToSafeObject(user: any): SafeUser {
  return {
    _id: user._id,
    organizationId: user.organizationId,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isPointOfContact: user.isPointOfContact,
    inviteStatus: user.inviteStatus,
    createdAt: user.createdAt,
    profilePicture: user?.profilePicture
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

router.get('/me', isAuth, (req: Request, res: Response<MeResponse | MeErrorResponse>) => {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ success: false, error: 'Not authenticated' });
  res.json({ success: true, user: userToSafeObject(user) });
});

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
