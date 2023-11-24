import z from 'zod';

export const getMealParamsSchema = z.object({
  id: z.string().uuid(),
});
