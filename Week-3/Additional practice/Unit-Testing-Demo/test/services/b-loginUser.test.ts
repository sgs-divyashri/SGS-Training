
'use strict';

import Lab from '@hapi/lab';
import { expect } from '@hapi/code';
import { init } from '../../src/server';
// import { init } from '../server';
import { Server } from '@hapi/hapi';

export const lab = Lab.script();
const { describe, it, beforeEach, afterEach } = lab;  // BDD - Behavior driven development

describe('POST /users/login', () => {
  let server: Server;

  beforeEach(async () => {
    server = await init();
  });

  afterEach(async () => {
    await server.stop();
  });

  it('fails with 400 when email pattern is invalid', async () => {
    const badPayload = {
      email: 'deeeeepssssss-gil.com',
      password: 'S3cret@123'
    };

    const res = await server.inject({
      method: 'post',
      url: '/users/login',
      payload: badPayload
    });

    expect(res.statusCode).to.equal(400);
    const body = JSON.parse(res.payload);
    expect(body.error).to.equal('Bad Request');
  });

  it('hashes the password with 200', async () => {
    const payload = {
      email: 'dheeenaa@example.com',
      password: 'StrongPass#9'
    };

    const res = await server.inject({
      method: 'post',
      url: '/users/login',
      payload
    });

    console.log(res.payload)

    expect(res.statusCode).to.equal(200);
    const body = JSON.parse(res.payload);

    console.log(body)

    expect(body.password).to.not.exist();         
    expect(body.email).to.equal(payload.email);
  });
});


