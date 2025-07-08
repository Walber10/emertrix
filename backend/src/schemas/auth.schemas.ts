import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Please provide a valid email address' })
    .email('Please provide a valid email address'),
  password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Please provide a valid email address' })
    .email('Please provide a valid email address'),
});

export type LoginRequest = z.infer<typeof loginSchema>;
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>;
