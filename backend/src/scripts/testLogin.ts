import 'dotenv/config';
import { connectToDatabase } from '../database/connectToDB';
import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';

async function main() {
  await connectToDatabase();

  // Find the master admin user
  const user = await User.findOne({ email: 'master@emertrix.com' });

  if (!user) {
    console.log('❌ User not found');
    return;
  }

  console.log('✅ User found:');
  console.log('Email:', user.email);
  console.log('Role:', user.role);
  console.log('Password hash:', user.password.substring(0, 20) + '...');

  // Test password verification
  const isValid = await bcrypt.compare('master123', user.password);
  console.log('Password verification:', isValid ? '✅ Valid' : '❌ Invalid');

  // Test with wrong password
  const isInvalid = await bcrypt.compare('wrongpassword', user.password);
  console.log('Wrong password test:', isInvalid ? '❌ Should be invalid' : '✅ Correctly invalid');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
