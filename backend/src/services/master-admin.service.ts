import { Organization } from '../models/organization.model';
import { User } from '../models/user.model';

export class MasterAdminService {
  static async getAllOrganizationsWithUserCounts() {
    const organizations = await Organization.find().lean();
    const results = await Promise.all(
      organizations.map(async org => {
        const userCount = await User.countDocuments({ organizationId: org._id });
        return { ...org, userCount };
      }),
    );
    return results;
  }
}
