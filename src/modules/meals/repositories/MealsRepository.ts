import { randomUUID } from 'node:crypto';

import { knex } from 'shared/infra/knex/database';
import { CreateMealDTO, UpdateMealDTO } from 'modules/meals/dtos/meal.dto';
import { Meal } from 'modules/meals/models/Meal';
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

  async findAll({ userId }: { userId: string }) {
    return await knex<Meal>('meals').where({ user_id: userId }).select('*');
  }

  async findById({ mealId, userId }: { mealId: string; userId: string }) {
    return await knex<Meal>('meals')
      .where({ id: mealId, user_id: userId })
      .first();
  }

  async update({
    id,
    userId,
    name,
    description,
    dateTime,
    isInDiet,
  }: UpdateMealDTO) {
    const [meal] = await knex<Meal>('meals')
      .where({ id, user_id: userId })
      .update({
        name,
        description,
        dateTime,
        isInDiet,
      })
      .returning('*');

    return meal;
  }

  async delete({ mealId, userId }: { mealId: string; userId: string }) {
    await knex<Meal>('meals').where({ id: mealId, user_id: userId }).delete();
  }
}

export const mealsRepository = new MealsRepository();
