
'use strict';

import Lab from '@hapi/lab';
import { expect } from '@hapi/code';
import { init_test } from '../../src/server';
// import { init } from '../server';
import { Server } from '@hapi/hapi';
import { User, UserPayload } from '../../src/models/userTableDefinition';

export const lab = Lab.script();
const { describe, it, beforeEach, afterEach } = lab;  // BDD - Behavior driven development
import { uniqueEmail } from './1.registerUser.test';


describe('POST /users/login', () => {
  let server: Server;

  beforeEach(async () => {
    server = await init_test();
  });

  afterEach(async () => {
    await server.stop();
  });

  it('LOGIN USER - fails with 400 when email pattern is invalid', async () => {
    const badPayload = {
      email: 'deeeeepssssss-gil.com',
      password: 'S3cret@123'
    };

    const res = await server.inject({
      method: 'post',
      url: '/users/login',
      payload: badPayload
    });

    expect(res.statusCode).to.equal(401);
    const body = JSON.parse(res.payload);
    expect(body.error).to.equal('Invalid email or password');
  });


  it('LOGIN USER - valid payload with 200', async () => {
    const payload = {
      email: uniqueEmail(),
      name: 'Devi',
      password: 'StrongPass#9',
      age: 25
    } as UserPayload

    const res = await server.inject({
      method: 'post',
      url: '/users/register',
      payload
    })

    expect(res.statusCode).to.equal(201)

    const payload_login = {
      email: payload.email,
      password: payload.password
    }

    // console.log( payload_login.email)
    const result = await server.inject({
      method: 'post',
      url: '/users/login',
      payload: payload_login
    })

    expect(result.statusCode).to.equal(200)
    const body = JSON.parse(result.payload)
    expect(payload_login.password).to.equal(payload.password)
    expect(body.token).to.exist()
  })


  it('LOGIN USER - returns 200 when entered password matches the stored hash password', async () => {
    const payload = {
      email: uniqueEmail(),
      name: 'Devi',
      password: 'StrongPass#9',
      age: 25
    } as UserPayload

    const res = await server.inject({
      method: 'post',
      url: '/users/register',
      payload
    });

    expect(res.statusCode).to.equal(201);
    const body = JSON.parse(res.payload);
    expect(body.userID).to.exist();
    expect(body.userID.password).to.not.exist();

    const saved = await User.findOne({ where: { email: payload.email }, attributes: { include: ["password"] } });
    expect(saved).to.exist();
    expect(saved?.password).to.not.equal(payload.password)

    const payload_login = { email: payload.email, password: payload.password }

    const login = await server.inject({
      method: 'post',
      url: '/users/login',
      payload: payload_login
    })

    expect(login.statusCode).to.equal(200)
    const response = JSON.parse(login.payload)
    const hash = saved!.get('password') as string;
    expect(hash).to.exist();
    expect(hash).to.not.equal(payload.password);
    // console.log("Response body: ", response)
    expect(response.message).to.exist()
    expect(response.token).to.exist();

  });


  it('LOGIN USER - Missing email or password with 400', async () => {
    const payload = {
      email: uniqueEmail(),
      name: 'Devi',
      password: 'StrongPass#9',
      age: 25
    } as UserPayload

    const res = await server.inject({
      method: 'post',
      url: '/users/register',
      payload
    })

    expect(res.statusCode).to.equal(201)

    const payload_login = {
      email: payload.email
    }

    // console.log( payload_login.email)
    const result = await server.inject({
      method: 'post',
      url: '/users/login',
      payload: payload_login
    })

    expect(result.statusCode).to.equal(400)
    const body = JSON.parse(result.payload)
    expect(body.error).to.equal('Email and password are required')
  })


  it('LOGIN USER - 401 when email and password dont match', async () => {
    const payload = {
      email: uniqueEmail(),
      name: 'Devi',
      password: 'StrongPass#9',
      age: 25
    } as UserPayload

    const res = await server.inject({
      method: 'post',
      url: '/users/register',
      payload
    })

    expect(res.statusCode).to.equal(201)

    const payload_login = {
      email: payload.email,
      password: "HEEEEeesndkjdb"
    }

    // console.log( payload_login.email)
    const result = await server.inject({
      method: 'post',
      url: '/users/login',
      payload: payload_login
    })

    expect(result.statusCode).to.equal(401)
    const body = JSON.parse(result.payload)
    expect(body.error).to.equal('Invalid email or password')
  })
});


