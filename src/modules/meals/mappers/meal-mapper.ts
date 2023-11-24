import { MealDTO } from 'modules/meals/dtos/meal.dto';
import { Meal } from 'modules/meals/models/Meal';

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
