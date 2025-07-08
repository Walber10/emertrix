import 'dotenv/config';
import { connectToDatabase } from '../database/connectToDB';
import { User } from '../models/user.model';
import { UserRole, InviteStatus } from '../models/user.model';
import bcrypt from 'bcryptjs';

async function main() {
  await connectToDatabase();

  const existingMaster = await User.findOne({ role: UserRole.MASTER });
  if (existingMaster) {
    console.log('Master admin already exists:', existingMaster.email);
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash('master123', 10);

  const masterAdmin = await User.create({
    organizationId: null,
    name: 'Master Admin',
    email: 'master@emertrix.com',
    phone: '123-456-7890',
    password: hashedPassword,
    role: UserRole.MASTER,
    isPointOfContact: false,
    inviteStatus: InviteStatus.ACCEPTED,
    createdAt: new Date(),
  });

  console.log('Master admin created successfully!');
  console.log('Email:', masterAdmin.email);
  console.log('Password: master123');
  console.log('Role:', masterAdmin.role);

  process.exit(0);
}

main().catch(err => {
  console.error('Error creating master admin:', err);
  process.exit(1);
});
