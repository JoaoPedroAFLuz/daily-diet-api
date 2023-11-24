import { ApiError } from 'shared/errors/api-error';
import { mealsRepository } from '../repositories/MealsRepository';
import { MealMapper } from '../mappers/meal-mapper';

interface FindMealByIdParams {
  mealId: string;
  userId: string;
}

export async function findMealByIdService({
  mealId,
  userId,
}: FindMealByIdParams) {
  const meal = await mealsRepository.findById({ mealId, userId });

  if (!meal) {
    throw new ApiError({ statusCode: 404, message: 'Meal not found' });
  }

  return MealMapper.toDTO(meal);
}
