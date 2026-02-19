'use strict';

import Lab from '@hapi/lab';
import { expect } from '@hapi/code';
import { Server } from '@hapi/hapi';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { v4 as uuid} from 'uuid'
import { init_test } from '../../src/server';
import { User } from '../../src/models/userTableDefinition';
import { sequelize } from '../../src/sequelize/sequelize';

export const lab = Lab.script();
const { describe, it, beforeEach, afterEach } = lab;

const uniqueEmail = () => `user_${Date.now()}_${Math.floor(Math.random()*1000)}@example.com`;

describe('POST /users/login', () => {
  let server: Server;

  beforeEach(async () => {
    process.env.NODE_ENV = 'test';
    server = await init_test();

    await sequelize.query('TRUNCATE TABLE tasks RESTART IDENTITY CASCADE;').catch(() => {});
    await sequelize.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE;');

    await User.create({
      userId: uuid(),
      name: 'Admin',
      email: 'admin@example.com',
      role: 'Admin',
      password: await bcrypt.hash('HD0315@u', 10),
    });
  });

  afterEach(async () => {
    await server.stop(); 
  });

  it('should return 400 when email or password missing', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/user/login',
      payload: { email: 'x@example.com' }, 
    });

    expect(res.statusCode).to.equal(400);
  });

  it('should return 400 for wrong password', async () => {
    const email = uniqueEmail();
    const password = 'StrongPass#9';

    await User.create({
      userId: uuid(),
      name: 'Devi',
      email,
      role: 'User',
      password: await bcrypt.hash(password, 10),
    });

    const res = await server.inject({
      method: 'POST',
      url: '/user/login',
      payload: { email, password: 'wrongpassword' }
    });

    expect(res.statusCode).to.equal(400);
  });

  it('should return 200 + token for correct credentials', async () => {
    const email = uniqueEmail();
    const password = 'StrongPass#9';

    await User.create({
      userId: uuid(),
      name: 'TestUser',
      email,
      role: 'User',
      password: await bcrypt.hash(password, 10),
    });

    const res = await server.inject({
      method: 'POST',
      url: '/user/login',
      payload: { email, password }
    });

    expect(res.statusCode).to.equal(200);
    const body = JSON.parse(res.payload);

    expect(body.token).to.exist();
    expect(body.message).to.exist();
  });

  it('should allow Admin seeded user to login successfully', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/user/login',
      payload: { email: 'admin@example.com', password: 'HD0315@u' }
    });

    expect(res.statusCode).to.equal(200);
    const body = JSON.parse(res.payload);
    expect(body.token).to.exist();
  });
});