import z from 'zod';

export const mealInputSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  description: z
    .string()
    .min(3, 'Description must be at least 3 characters long'),
  dateTime: z.string().datetime('Date time invalid'),
  isInDiet: z.boolean({
    required_error: 'Is in diet required',
  }),
});

export type MealInputDTO = z.infer<typeof mealInputSchema> & {
  userId: string;
};
