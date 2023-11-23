import { randomUUID } from 'crypto';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { knex } from '../database';

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/', async (req, res) => {
    const createTransactionBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      dateTime: z.string(),
      isDiet: z.boolean(),
    });

    const { name, description, dateTime, isDiet } =
      createTransactionBodySchema.parse(req.body);

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      dateTime,
      isDiet,
    });

    return res.status(201).send();
  });

  app.get('/', async () => {
    const meals = await knex('meals').select('*');

    return { meals };
  });
}
