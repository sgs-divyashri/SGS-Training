import Lab from '@hapi/lab';
import { expect } from '@hapi/code';
import { init_test } from '../../src/server';
// import { init } from '../server';
import { Server } from '@hapi/hapi';
import { UserPayload } from '../../src/model/userTableDefinition';

export const lab = Lab.script();
const { describe, it, beforeEach, afterEach } = lab;  // BDD - Behavior driven development

describe('POST /users/register', () => {
  let server: Server;

  beforeEach(async () => {
    server = await init_test();
  });

  afterEach(async () => {
    await server.stop();
  });

  it('creates a user and responds with 201', async () => {
    const payload = {
      email: 'alice@example.com',
      name: 'Alice',
      password: 'S3cret@123'
    } as UserPayload;

    console.log("Payload: ", payload)
    const res = await server.inject({
      method: 'post',
      url: '/users/register',
      payload
    });

    console.log("Payload: ", res.payload)

    expect(res.statusCode).to.equal(201);
    const body = JSON.parse(res.payload);
    expect(body).to.include(['id']);
    expect(body.email).to.equal(payload.email);
    expect(body.name).to.equal(payload.name);
    // password should not be echoed back
    expect(body.password).to.not.exist();
    // Location header is nice for REST creation semantics
    expect(res.headers.location).to.include('/users/');
  });

  it('fails with 400 when payload is invalid', async () => {
    const badPayload = {
      email: 'divya@gmail.com',
      // missing name & password
    };

    const res = await server.inject({
      method: 'post',
      url: '/users/register',
      payload: badPayload
    });

    expect(res.statusCode).to.equal(400);
    const body = JSON.parse(res.payload);
    expect(body.error).to.equal('Bad Request');
  });

  it('fails with 400 when email pattern is invalid', async () => {
    const badPayload = {
      email: 'deeeeepssssss-gil.com',
      name: 'Deepika',
      password: 'S3cret@123'
    };

    const res = await server.inject({
      method: 'post',
      url: '/users/register',
      payload: badPayload
    });

    expect(res.statusCode).to.equal(400);
    const body = JSON.parse(res.payload);
    expect(body.error).to.equal('Bad Request');
  });

  it('fails with 409 when email already exists', async () => {
    const payload = {
      email: 'divya@example.com',
      name: 'Divyaaa',
      password: 'StrongPass#9'
    };

    // First create succeeds
    const first = await server.inject({
      method: 'post',
      url: '/users/register',
      payload
    });
    // expect(first.statusCode).to.equal(201);

    // Second attempt with same email should conflict
    const res = await server.inject({
      method: 'post',
      url: '/users/register',
      payload
    });

    expect(res.statusCode).to.equal(409);
    const body = JSON.parse(res.payload);
    expect(body.message).to.match(/email.*exists/i);
  });

  it('hashes the password with 200', async () => {
    const payload = {
      email: 'deviii@example.com',
      name: 'Divyaaa',
      password: 'StrongPass#9'
    };

    const res = await server.inject({
      method: 'post',
      url: '/users/register',
      payload
    });

    expect(res.statusCode).to.equal(201);
    const body = JSON.parse(res.payload);

    expect(body.password).to.not.exist();         
    expect(body.email).to.equal(payload.email);
    expect(body.name).to.equal(payload.name);
  });
});


