import { MealMapper } from '../mappers/meal-mapper';
import { mealsRepository } from '../repositories/MealsRepository';

interface FindAllMealsServiceParams {
  userId: string;
}

export async function findAllMealsService({
  userId,
}: FindAllMealsServiceParams) {
  const meals = await mealsRepository.findAll({ userId });

  return meals.map(MealMapper.toDTO);
}
