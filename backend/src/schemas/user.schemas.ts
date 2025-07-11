import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  profilePicture: z.string().optional(),
});

export type UpdateUserRequest = z.infer<typeof updateUserSchema>;
