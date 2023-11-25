import { env } from 'config/env';
import { app } from './app';

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log(`HTTP Server running on http://localhost:${env.PORT}`);
  });
