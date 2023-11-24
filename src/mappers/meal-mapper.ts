import { MealDTO } from 'dtos/meal.dto';
import { Meal } from 'models/Meal';

export class MealMapper {
  static toDTO(meal: Meal): MealDTO {
    return {
      id: meal.id,
      name: meal.name,
      description: meal.description,
      isInDiet: meal.isInDiet,
      dateTime: meal.dateTime,
    };
  }
}
