import fastifyCookie from '@fastify/cookie';
import fastify from 'fastify';

import { routes } from 'shared/infra/http/routes';
import { errorHandler } from './middlewares/error-handler';

export const app = fastify();

app.register(fastifyCookie);
app.register(routes);

errorHandler(app);
