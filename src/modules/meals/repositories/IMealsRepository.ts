import { MealDTO, CreateMealDTO } from '../dtos/meal.dto';

export interface IMealsRepository {
  create(data: CreateMealDTO): Promise<void>;
  findAll(data: { userId: string }): Promise<MealDTO[]>;
  findById(data: { mealId: string; userId: string }): Promise<MealDTO>;
  delete(data: { mealId: string; userId: string }): Promise<void>;
}
