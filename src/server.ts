import fastifyCookie from '@fastify/cookie';
import fastify from 'fastify';

import { env } from './env';
import { mealsRoutes } from './routes/meals';

const app = fastify();

app.register(fastifyCookie);
app.register(mealsRoutes, {
  prefix: '/meals',
});

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log(`HTTP Server running on http://localhost:${env.PORT}`);
  });
