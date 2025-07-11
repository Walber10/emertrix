import express, { Request, Response } from 'express';
import { OrganizationService } from '../services/organization-service';
import { OrganizationStats } from '../models/organization.model';
import { ApiResponse } from '../models/responses.model';

const router = express.Router();

router.get(
  '/:id',
  async (req: Request<{ id: string }>, res: Response<ApiResponse<OrganizationStats>>) => {
    try {
      const data: OrganizationStats = await OrganizationService.getOrganizationStats(req.params.id);
      res.json({ success: true, data });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(404).json({ success: false, error: err.message });
      } else {
        res.status(404).json({ success: false, error: 'An unknown error occurred' });
      }
    }
  },
);

export { router as organizationsRouter };
