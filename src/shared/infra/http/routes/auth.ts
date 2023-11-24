import { FastifyInstance } from 'fastify';

import { authenticateService } from 'modules/accounts/services/authenticate';
import { signInService } from 'modules/accounts/services/sing-in';
import { authenticateUserBodySchema } from '../schemas/authenticate-user-schema';
import { createUserBodySchema } from '../schemas/create-user-schema';

export async function authRoutes(app: FastifyInstance) {
  app.post('/sign-up', async (request, reply) => {
    const { name, email, password } = createUserBodySchema.parse(request.body);

    const accessToken = await signInService({ name, email, password });

    return reply.status(201).send({ accessToken });
  });

  app.post('/log-in', async (request, reply) => {
    const { email, password } = authenticateUserBodySchema.parse(request.body);

    const accessToken = await authenticateService({ email, password });

    return reply.status(200).send({
      accessToken,
    });
  });
}
