import { compare, hash } from 'bcryptjs';
import { FastifyInstance } from 'fastify';
import { sign } from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';

import auth from '../config/auth';
import { knex } from '../database';
import { env } from '../env';

export async function authRoutes(app: FastifyInstance) {
  app.post('/sign-up', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string().min(3, 'Must provide full name'),
      email: z.string().email('Invalid e-mail'),
      password: z
        .string()
        .min(8, 'Password must be at least 8 characters long'),
    });

    const { name, email, password } = createUserBodySchema.parse(request.body);

    const emailAlreadyInUse = await knex('users').where({ email }).first();

    if (emailAlreadyInUse) {
      return reply.status(409).send({ message: 'Email already in use' });
    }

    const hashedPassword = await hash(password, 12);

    const [user] = await knex('users')
      .insert({
        id: randomUUID(),
        name,
        email,
        password: hashedPassword,
      })
      .returning('*');

    const access_token = sign({}, env.JWT_SECRET, {
      subject: user.id,
      expiresIn: auth.expiresIn,
    });

    return reply.status(201).send({ access_token });
  });

  app.post('/log-in', async (request, reply) => {
    const authenticateUserBodySchema = z.object({
      email: z.string().email('Invalid e-mail'),
      password: z
        .string()
        .min(8, 'Password must be at least 8 characters long'),
    });

    const { email, password } = authenticateUserBodySchema.parse(request.body);

    const user = await knex('users').where({ email }).first();

    if (!user) {
      return reply.status(400).send({ message: 'Credentials invalid' });
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      return reply.status(400).send({ message: 'Credentials invalid' });
    }

    const access_token = sign({}, env.JWT_SECRET, {
      subject: user.id,
      expiresIn: auth.expiresIn,
    });

    return reply.status(200).send({
      access_token,
    });
  });
}