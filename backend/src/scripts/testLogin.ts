import { prisma } from '../database/connectToDB';
import { AuthService } from '../services/auth.service';

async function testLogin() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'master@emertrix.com' },
    });

    if (!user) {
      console.log('Master admin not found');
      return;
    }

    const { user: loggedInUser, token } = await AuthService.login(
      'master@emertrix.com',
      'master123',
    );
    console.log('Login successful:', loggedInUser.email);
    console.log('Token generated:', token.substring(0, 20) + '...');
  } catch (error) {
    console.error('Login failed:', error);
  }
}

testLogin().catch(console.error);
