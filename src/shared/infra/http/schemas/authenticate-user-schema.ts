import z from 'zod';

export const authenticateUserBodySchema = z.object({
  email: z.string().email('Invalid e-mail'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});
