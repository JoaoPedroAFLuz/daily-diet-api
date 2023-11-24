import fastifyCookie from '@fastify/cookie';
import fastify from 'fastify';

import { env } from 'config/env';
import { routes } from 'shared/infra/http/routes';
import { errorHandler } from './middlewares/error-handler';

const app = fastify();

app.register(fastifyCookie);
app.register(routes);

errorHandler(app);

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log(`HTTP Server running on http://localhost:${env.PORT}`);
  });
