import { CreateMealDTO, MealDTO } from 'modules/meals/dtos/meal.dto';

export interface IMealsRepository {
  create(data: CreateMealDTO): Promise<void>;

  findAll(data: { userId: string }): Promise<MealDTO[]>;

  findById(data: { mealId: string; userId: string }): Promise<MealDTO>;
}
