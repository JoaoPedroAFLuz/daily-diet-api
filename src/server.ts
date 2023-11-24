import fastifyCookie from '@fastify/cookie';
import fastify from 'fastify';

import { env } from './env';
import { errorHandler } from './middlewares/error-handler';
import { routes } from './routes';

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
