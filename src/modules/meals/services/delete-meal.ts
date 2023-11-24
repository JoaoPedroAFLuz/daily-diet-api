import { ApiError } from 'shared/errors/api-error';
import { mealsRepository } from '../repositories/MealsRepository';

interface DeleteMealParams {
  mealId: string;
  userId: string;
}

export async function deleteMealService({ mealId, userId }: DeleteMealParams) {
  const meal = await mealsRepository.findById({ mealId, userId });

  if (!meal) {
    throw new ApiError({
      statusCode: 404,
      message: 'Meal not found',
    });
  }

  await mealsRepository.delete({ mealId, userId });
}
