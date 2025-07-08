import { Request, Response, NextFunction } from 'express';

export function requireMaster(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (!user || user.role !== 'master') {
    return res.status(403).json({ success: false, error: 'Master access required' });
  }
  next();
}
