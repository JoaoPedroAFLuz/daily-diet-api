import { MealMetricsDTO } from '../dtos/meal.dto';
import { Meal } from '../models/Meal';
import { mealsRepository } from '../repositories/MealsRepository';

interface FindMetricsParams {
  userId: string;
}

export async function findMealMetrics({ userId }: FindMetricsParams) {
  const meals = await mealsRepository.findAll({ userId });

  const mealsOnDiet = meals.filter((meals) => !!meals.isInDiet);
  const mealsOffDiet = meals.filter((meals) => !meals.isInDiet);

  const bestSequence = calculateConsecutiveMeals(meals);

  const mealMetrics: MealMetricsDTO = {
    totalMeals: meals.length,
    totalMealsOnDiet: mealsOnDiet.length,
    totalMealsOffDiet: mealsOffDiet.length,
    bestSequence,
  };

  return mealMetrics;
}

function calculateConsecutiveMeals(meals: Meal[]) {
  let currentCount = 0;
  let maxCount = 0;

  for (const meal of meals) {
    if (meal.isInDiet) {
      currentCount++;
      maxCount = Math.max(maxCount, currentCount);
    } else {
      currentCount = 0;
    }
  }

  return maxCount;
}
