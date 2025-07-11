export type { Organization as IOrganization } from '@prisma/client';
export { PlanTier } from '@prisma/client';

export interface OrganizationStats {
  stats: {
    totalUsers: number;
    totalSeats: number;
    usedSeats: number;
    availableSeats: number;
  };
}
