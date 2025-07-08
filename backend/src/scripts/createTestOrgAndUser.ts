import 'dotenv/config';
import { connectToDatabase } from '../database/connectToDB';
import { Organization } from '../models/organization.model';
import { User } from '../models/user.model';
import { Types } from 'mongoose';

async function main() {
  await connectToDatabase();

  // Create organization
  const org = await Organization.create({
    name: 'Test Org',
    address: '123 Main St',
    phoneNumber: '123-456-7890',
    industry: 'Technology',
    natureOfWork: 'Software Development',
    abn: '12345678901',
    organizationSize: '11-50',
    selectedPlan: 'tier1',
    maxFacilities: 1,
    totalSeats: 50,
    createdAt: new Date(),
  });

  // Create admin user
  const admin = await User.create({
    organizationId: org._id,
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '123-456-7890',
    role: 'admin',
    inviteStatus: 'accepted',
    createdAt: new Date(),
  });

  // Update organization with adminId
  org.adminId = admin._id as Types.ObjectId;
  await org.save();

  // Create additional admin user
  await User.create({
    organizationId: org._id,
    name: 'Additional Admin User',
    email: 'additional-admin@example.com',
    phone: '123-456-7890',
    role: 'admin',
    inviteStatus: 'accepted',
    createdAt: new Date(),
  });

  console.log('Test organization and admin users created!');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
