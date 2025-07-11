import { prisma } from '../database/connectToDB';
import bcrypt from 'bcryptjs';
import { generateToken } from '../configuration/auth';
import { EmailService } from './email.service';
import crypto from 'crypto';

function generatePasswordResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export class AuthService {
  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { organization: true },
    });

    if (!user) throw new Error('Invalid email or password');
    if (!user.password) throw new Error('Invalid email or password');

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error('Invalid email or password');

    const token = generateToken(user.id);
    return { user, token };
  }

  static async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return {
        message: 'If an account with that email exists, a password reset link has been sent.',
      };
    }

    const resetToken = generatePasswordResetToken();
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: expires,
      },
    });

    // Send email with reset link
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
    const resetLink = `${frontendUrl.replace(/\/$/, '')}/reset-password?token=${resetToken}`;

    await EmailService.sendEmail({
      to: user.email,
      subject: 'Password Reset Request - Emertrix',
      html: `
        <h2>Password Reset Request</h2>
        <p>Hello ${user.name},</p>
        <p>You have requested to reset your password for your Emertrix account.</p>
        <p>Click the link below to reset your password. This link will expire in 1 hour:</p>
        <p><a href="${resetLink}" style="background-color: #FF6500; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a></p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <p>Best regards,<br>The Emertrix Team</p>
      `,
    });

    return {
      message: 'If an account with that email exists, a password reset link has been sent.',
    };
  }

  static async resetPassword(token: string, newPassword: string) {
    const user = await prisma.user.findUnique({
      where: { passwordResetToken: token },
    });

    if (!user) {
      throw new Error('Invalid or expired reset token.');
    }

    if (!user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      throw new Error('Reset token has expired.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    return { message: 'Password has been reset successfully.' };
  }

  static async validateResetToken(token: string) {
    const user = await prisma.user.findUnique({
      where: { passwordResetToken: token },
    });

    if (!user) {
      throw new Error('Invalid reset token.');
    }

    if (!user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      throw new Error('Reset token has expired.');
    }

    return { valid: true, email: user.email };
  }
}
