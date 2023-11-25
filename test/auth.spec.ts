import { execSync } from 'node:child_process';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { app } from 'shared/infra/http/app';

describe('Auth rotes', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    execSync('npm run knex -- migrate:rollback --all');
    execSync('npm run knex -- migrate:latest');
  });

  it('should be able to sign-up', async () => {
    const response = await request(app.server)
      .post('/auth/sign-up')
      .send({
        name: 'John Doe',
        email: 'john@email.com',
        password: 'John12345',
      })
      .expect(201);

    expect(response.body.accessToken).toEqual(expect.any(String));
  });

  it('should not be able to sign-up with invalid e-mail', async () => {
    await request(app.server)
      .post('/auth/sign-up')
      .send({
        name: 'John Doe',
        email: 'john.com',
        password: 'John12345',
      })
      .expect(400);
  });

  it('should not be able to sign-up with invalid password', async () => {
    await request(app.server)
      .post('/auth/sign-up')
      .send({
        name: 'John Doe',
        email: 'john@email.com',
        password: 'John',
      })
      .expect(400);
  });

  it('should be able to log-in', async () => {
    await request(app.server).post('/auth/sign-up').send({
      name: 'John Doe',
      email: 'john@email.com',
      password: 'John12345',
    });

    const response = await request(app.server)
      .post('/auth/log-in')
      .send({
        email: 'john@email.com',
        password: 'John12345',
      })
      .expect(200);

    expect(response.body.accessToken).toEqual(expect.any(String));
  });

  it('should not be able to log-in with invalid e-mail', async () => {
    await request(app.server).post('/auth/sign-up').send({
      name: 'John Doe',
      email: 'john@email.com',
      password: 'John12345',
    });

    await request(app.server)
      .post('/auth/log-in')
      .send({
        email: 'doe@email.com',
        password: 'John12345',
      })
      .expect(400);
  });

  it('should not be able to log-in with invalid password', async () => {
    await request(app.server).post('/auth/sign-up').send({
      name: 'John Doe',
      email: 'john@email.com',
      password: 'John12345',
    });

    await request(app.server)
      .post('/auth/log-in')
      .send({
        email: 'john@email.com',
        password: 'Doe12345',
      })
      .expect(400);
  });
});
