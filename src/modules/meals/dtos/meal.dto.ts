export interface CreateMealDTO {
  userId: string;
  name: string;
  description: string;
  dateTime: string;
  isInDiet: boolean;
}

export interface MealDTO {
  id: string;
  name: string;
  description: string;
  dateTime: string;
  isInDiet: boolean;
}

export interface MealMetricsDTO {
  totalMeals: number;
  totalMealsOnDiet: number;
  totalMealsOffDiet: number;
  bestSequence: number;
}
