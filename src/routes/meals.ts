import { randomUUID } from 'crypto';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { knex } from '../database';
import { Meals } from '../models/Meals';

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/', async (req, res) => {
    const createTransactionBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      dateTime: z.string(),
      isInDiet: z.boolean(),
    });

    const { name, description, dateTime, isInDiet } =
      createTransactionBodySchema.parse(req.body);

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      dateTime,
      isInDiet,
    });

    return res.status(201).send();
  });

  app.get('/', async () => {
    const meals = await knex('meals').select('*');

    return { meals };
  });

  app.get('/:id', async (req, res) => {
    const getMealParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = getMealParamsSchema.parse(req.params);

    const meal = await knex('meals').where({ id }).first();

    if (!meal) {
      return res.status(404).send();
    }

    return { meal };
  });

  app.get('/metrics', async () => {
    const meals: Meals[] = await knex('meals').select('*');

    const mealsOnDiet = meals.filter((meals) => !!meals.isInDiet);
    const mealsOffDiet = meals.filter((meals) => !meals.isInDiet);

    const bestSequence = calculateConsecutiveMeals(meals);

    const metrics = {
      total: meals.length,
      totalMealsOnDiet: mealsOnDiet.length,
      totalMealsOffDiet: mealsOffDiet.length,
      bestSequence,
    };

    return { metrics };
  });

  function calculateConsecutiveMeals(meals: Meals[]) {
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
}
