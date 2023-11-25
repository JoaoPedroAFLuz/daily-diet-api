import { ApiError } from 'shared/errors/api-error';
import { MealMapper } from '../mappers/meal-mapper';
import { mealsRepository } from '../repositories/MealsRepository';

interface FindMealByIdServiceParams {
  mealId: string;
  userId: string;
}

export async function findMealByIdService({
  mealId,
  userId,
}: FindMealByIdServiceParams) {
  const meal = await mealsRepository.findById({ mealId, userId });

  if (!meal) {
    throw new ApiError({ statusCode: 404, message: 'Meal not found' });
  }

  return MealMapper.toDTO(meal);
}
