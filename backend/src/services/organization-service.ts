import { prisma } from '../database/connectToDB';
import { OrganizationStats } from '../models/organization.model';

export class OrganizationService {
  static async getOrganizationStats(orgId: string): Promise<OrganizationStats> {
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      include: {
        users: true,
      },
    });

    if (!org) throw new Error('Organization not found');

    const totalUsers = org.users.length;
    const usedSeats = org.users.filter(u => org.adminId && u.id !== org.adminId).length;
    const totalSeats = org.totalSeats || 0;
    const availableSeats = totalSeats - usedSeats;

    return {
      stats: { totalUsers, totalSeats, usedSeats, availableSeats },
    };
  }
}
