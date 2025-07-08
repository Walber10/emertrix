import { User, IUser } from '../models/user.model';
import bcrypt from 'bcryptjs';
import { generateToken } from '../configuration/auth';

export class AuthService {
  static async login(email: string, password: string) {
    const user = (await User.findOne({ email })) as IUser | null;
    if (!user) throw new Error('Invalid email or password');
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error('Invalid email or password');
    const token = generateToken((user._id as any).toString());
    return { user, token };
  }

  static async forgotPassword(email: string) {
    const user = await User.findOne({ email });
    if (!user) throw new Error('No user with that email');
    return { message: 'Password reset link will be sent (stub)' };
  }
}
