import { prisma } from '../database/connectToDB';
import { OrganizationWithUserCount } from '../types/masterAdmin.types';

export class MasterAdminService {
  static async getAllOrganizationsWithUserCounts(): Promise<OrganizationWithUserCount[]> {
    const organizations = await prisma.organization.findMany({
      include: {
        _count: {
          select: { users: true },
        },
      },
    });

    const results: OrganizationWithUserCount[] = organizations.map(org => ({
      id: org.id,
      name: org.name,
      address: org.address,
      phoneNumber: org.phoneNumber,
      industry: org.industry,
      natureOfWork: org.natureOfWork,
      abn: org.abn,
      organizationSize: org.organizationSize,
      selectedPlan: org.selectedPlan,
      maxFacilities: org.maxFacilities,
      totalSeats: org.totalSeats,
      adminId: org.adminId,
      createdAt: org.createdAt,
      userCount: org._count.users,
    }));

    return results;
  }
}
