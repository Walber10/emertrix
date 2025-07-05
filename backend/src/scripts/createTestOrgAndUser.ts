import 'dotenv/config';
import { connectToDatabase } from '../database/connectToDB';
import { Organization } from '../models/Organization';
import { User } from '../models/User';
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

  // Create owner user
  const owner = await User.create({
    organizationId: org._id,
    name: 'Owner User',
    email: 'owner@example.com',
    phone: '123-456-7890',
    role: 'owner',
    inviteStatus: 'accepted',
    createdAt: new Date(),
  });

  // Update organization with ownerId
  org.ownerId = owner._id as Types.ObjectId;
  await org.save();

  // Create admin user
  await User.create({
    organizationId: org._id,
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '123-456-7890',
    role: 'admin',
    inviteStatus: 'accepted',
    createdAt: new Date(),
  });

  console.log('Test organization, owner, and admin user created!');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
