import z from 'zod';

export const createUserBodySchema = z.object({
  name: z.string().min(3, 'Must provide full name'),
  email: z.string().email('Invalid e-mail'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});
