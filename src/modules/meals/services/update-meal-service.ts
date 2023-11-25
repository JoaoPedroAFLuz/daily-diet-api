import { ApiError } from 'shared/errors/api-error';
import { mealsRepository } from '../repositories/MealsRepository';

interface UpdateMealServiceParams {
  mealId: string;
  userId: string;
  name: string;
  description: string;
  dateTime: string;
  isInDiet: boolean;
}

export async function updateMealService({
  mealId,
  userId,
  name,
  description,
  dateTime,
  isInDiet,
}: UpdateMealServiceParams) {
  const meal = await mealsRepository.findById({ mealId, userId });

  if (!meal) {
    throw new ApiError({
      statusCode: 404,
      message: 'Meal not found',
    });
  }

  const mealUpdated = await mealsRepository.update({
    id: mealId,
    userId,
    name,
    description,
    dateTime,
    isInDiet,
  });

  return { mealUpdated };
}
