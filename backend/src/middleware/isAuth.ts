import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../configuration/auth';
import { User } from '../models/user.model';

export async function isAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authenticated' });
  }
  try {
    const payload = verifyToken(token) as any;
    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }
    (req as any).user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
}
