import fastify from 'fastify';
import { randomUUID } from 'node:crypto';

import { knex } from './database';
import { env } from './env';

const app = fastify();

app.get('/meals', async () => {
  const tables = await knex('meals').select('*');

  return tables;
});

app.post('/meals', async (req, res) => {
  const transaction = await knex('meals')
    .insert({
      id: randomUUID(),
      name: 'Hamburger',
      description: 'Sandwich',
      dateTime: new Date().toISOString(),
      isDiet: false,
    })
    .returning('*');

  return res.status(201).send({ transaction });
});

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log(`HTTP Server running on http://localhost:${env.PORT}`);
  });
