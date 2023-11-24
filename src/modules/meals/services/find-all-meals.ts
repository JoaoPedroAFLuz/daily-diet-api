import { MealMapper } from '../mappers/meal-mapper';
import { mealsRepository } from '../repositories/MealsRepository';

interface GetAllMealsParams {
  userId: string;
}

export async function findAllMeals({ userId }: GetAllMealsParams) {
  const meals = await mealsRepository.findAll({ userId });

  return meals.map(MealMapper.toDTO);
}
