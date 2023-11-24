import z from 'zod';

export const createMealSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  description: z
    .string()
    .min(3, 'Description must be at least 3 characters long'),
  dateTime: z.string().datetime('Date time invalid'),
  isInDiet: z.boolean({
    required_error: 'Is in diet required',
  }),
});

export type CreateMealDTO = z.infer<typeof createMealSchema> & {
  userId: string;
};

export interface MealDTO {
  id: string;
  name: string;
  description: string;
  dateTime: string;
  isInDiet: boolean;
}

export interface MealMetricsDTO {
  totalMeals: number;
  totalMealsOnDiet: number;
  totalMealsOffDiet: number;
  bestSequence: number;
}
