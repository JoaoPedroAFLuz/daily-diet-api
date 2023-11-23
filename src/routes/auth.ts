import { randomUUID } from 'node:crypto';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { hash } from 'bcryptjs';

import { knex } from '../database';

export async function authRoutes(app: FastifyInstance) {
  app.post('/sign-up', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
    });

    const { name, email, password } = createUserBodySchema.parse(request.body);

    const emailAlreadyInUse = await knex('users').where({ email }).first();

    if (emailAlreadyInUse) {
      return reply.status(409).send({ message: 'Email already in use' });
    }

    const hashedPassword = await hash(password, 12);

    await knex('users')
      .insert({
        id: randomUUID(),
        name,
        email,
        password: hashedPassword,
      })
      .returning('*');

    return reply.status(201).send();
  });
}
