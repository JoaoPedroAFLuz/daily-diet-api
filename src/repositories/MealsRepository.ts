import { randomUUID } from 'node:crypto';

import { knex } from 'database';
import { CreateMealDTO } from 'dtos/meal.dto';
import { Meal } from 'models/Meal';
import { IMealsRepository } from './IMealsRepository';

class MealsRepository implements IMealsRepository {
  async create({
    userId,
    name,
    description,
    dateTime,
    isInDiet,
  }: CreateMealDTO) {
    await knex<Meal>('meals').insert({
      id: randomUUID(),
      user_id: userId,
      name,
      description,
      dateTime,
      isInDiet,
    });
  }

  async findAll(userId: string) {
    return await knex<Meal>('meals').where({ user_id: userId }).select('*');
  }

  async findById(mealId: string, userId: string) {
    return await knex<Meal>('meals')
      .where({ id: mealId, user_id: userId })
      .first();
  }
}

export const mealsRepository = new MealsRepository();
