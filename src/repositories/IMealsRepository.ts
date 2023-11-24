import { CreateMealDTO, MealDTO } from 'dtos/meal.dto';

export interface IMealsRepository {
  create(meal: CreateMealDTO): Promise<void>;

  findAll(userId: string): Promise<MealDTO[]>;

  findById(mealId: string, userId: string): Promise<MealDTO>;
}
