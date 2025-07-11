import { prisma } from '../database/connectToDB';
import { UserRole, InviteStatus, PlanTier } from '@prisma/client';
import bcrypt from 'bcryptjs';

async function createTestOrgAndUser() {
  // Create organization
  const org = await prisma.organization.create({
    data: {
      name: 'Test Organization',
      address: '123 Test St',
      phoneNumber: '123-456-7890',
      industry: 'Technology',
      organizationSize: '11-50',
      selectedPlan: PlanTier.TIER1,
      maxFacilities: 5,
      totalSeats: 100,
    },
  });

  console.log('Organization created:', org.name);

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      organizationId: org.id,
      name: 'Test Admin',
      email: 'admin@test.com',
      phone: '123-456-7890',
      password: hashedPassword,
      role: UserRole.ADMIN,
      isPointOfContact: true,
      inviteStatus: InviteStatus.ACCEPTED,
    },
  });

  console.log('Admin created:', admin.email);

  // Update organization with admin ID
  await prisma.organization.update({
    where: { id: org.id },
    data: { adminId: admin.id },
  });

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.create({
    data: {
      organizationId: org.id,
      name: 'Test User',
      email: 'user@test.com',
      phone: '123-456-7890',
      password: userPassword,
      role: UserRole.OCCUPANT,
      isPointOfContact: false,
      inviteStatus: InviteStatus.ACCEPTED,
    },
  });

  console.log('User created:', user.email);
}

createTestOrgAndUser().catch(console.error);
