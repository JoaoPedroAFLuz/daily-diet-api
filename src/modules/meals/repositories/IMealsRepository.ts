import { MealDTO, CreateMealDTO, UpdateMealDTO } from '../dtos/meal.dto';
import { Meal } from '../models/Meal';

export interface IMealsRepository {
  create(data: CreateMealDTO): Promise<void>;
  findAll(data: { userId: string }): Promise<MealDTO[]>;
  findById(data: { mealId: string; userId: string }): Promise<MealDTO>;
  update(data: UpdateMealDTO): Promise<Meal>;
  delete(data: { mealId: string; userId: string }): Promise<void>;
}
