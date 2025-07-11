// Import Prisma types
import type { User } from '@prisma/client';
import { UserRole, InviteStatus } from '@prisma/client';

// Re-export for compatibility
export { UserRole, InviteStatus };
export type IUser = User;

// You can add any additional user-related utilities here
export class UserUtils {
  static isPasswordRequired(inviteStatus: InviteStatus): boolean {
    return inviteStatus !== InviteStatus.PENDING;
  }
}
