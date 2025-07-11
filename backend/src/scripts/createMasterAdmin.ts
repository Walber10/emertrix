import { prisma } from '../database/connectToDB';
import { UserRole, InviteStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

async function createMasterAdmin() {
  const existingMaster = await prisma.user.findFirst({
    where: { role: UserRole.MASTER },
  });

  if (existingMaster) {
    console.log('Master admin already exists');
    return;
  }

  const hashedPassword = await bcrypt.hash('master123', 10);
  const masterAdmin = await prisma.user.create({
    data: {
      name: 'Master Admin',
      email: 'master@emertrix.com',
      phone: '123-456-7890',
      password: hashedPassword,
      role: UserRole.MASTER,
      isPointOfContact: false,
      inviteStatus: InviteStatus.ACCEPTED,
    },
  });

  console.log('Master admin created:', masterAdmin.email);
}

createMasterAdmin().catch(console.error);
