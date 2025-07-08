import express, { Request, Response } from 'express';
import { isAuth } from '../middleware/isAuth';
import { requireMaster } from '../middleware/requireMaster';
import { GetOrganizationsResponse, GetOrganizationsErrorResponse } from '../types';
import { MasterAdminService } from '../services/master-admin.service';

const router = express.Router();

router.get(
  '/organizations',
  isAuth,
  requireMaster,
  async (req: Request, res: Response<GetOrganizationsResponse | GetOrganizationsErrorResponse>) => {
    try {
      const orgs = await MasterAdminService.getAllOrganizationsWithUserCounts();
      res.json({ success: true, organizations: orgs });
    } catch (err) {
      res.status(500).json({ success: false, error: err instanceof Error ? err.message : 'Error' });
    }
  },
);

export default router;
