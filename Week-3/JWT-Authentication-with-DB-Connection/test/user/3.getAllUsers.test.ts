'use strict';

import Lab from '@hapi/lab';
import { expect } from '@hapi/code';
import { init_test } from '../../src/server';
// import { init } from '../server';
import { Server } from '@hapi/hapi';
import { UserPayload } from '../../src/models/userTableDefinition';

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

    it('GET ALL USERS - retrieve all the users with 200', async () => {
        const payload = {
            name: 'Devi',
            email: uniqueEmail(),
            password: 'Divyaaa@Sheiii0315',
            age: 22
        } as UserPayload;

        const res = await server.inject({
            method: 'post',
            url: '/users/register',
            payload
        });

        expect(res.statusCode).to.equal(201);

        const payload_login = { email: payload.email, password: payload.password }

        const login = await server.inject({
            method: 'post',
            url: '/users/login',
            payload: payload_login
        })

        expect(login.statusCode).to.equal(200)
        const response = JSON.parse(login.payload)
        expect(response.token).to.exist();

        const token = response.token as string
        const getAll = await server.inject({
            method: 'get',
            url: '/users',
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        expect(getAll.statusCode).to.equal(200)
        const body = JSON.parse(getAll.payload)
        expect(body.users).to.exist()
    })

    it('GET ALL USERS - 401 Missing authentication error', async () => {
        const payload = {
            name: 'Devi',
            email: uniqueEmail(),
            password: 'Divyaaa@Sheiii0315',
            age: 22
        } as UserPayload;

        const res = await server.inject({
            method: 'post',
            url: '/users/register',
            payload
        });

        expect(res.statusCode).to.equal(201);

        const payload_login = { email: payload.email, password: payload.password }

        const login = await server.inject({
            method: 'post',
            url: '/users/login',
            payload: payload_login
        })

        expect(login.statusCode).to.equal(200)
        const response = JSON.parse(login.payload)
        expect(response.token).to.exist();

        const getAll = await server.inject({
            method: 'get',
            url: '/users'
        })

        expect(getAll.statusCode).to.equal(401)
    })


    it('GET ALL USERS - 404 not found for invalid Endpoint', async () => {
        const payload = {
            name: 'Devi',
            email: uniqueEmail(),
            password: 'Divyaaa@Sheiii0315',
            age: 22
        } as UserPayload;

        const res = await server.inject({
            method: 'post',
            url: '/users/register',
            payload
        });

        expect(res.statusCode).to.equal(201);

        const payload_login = { email: payload.email, password: payload.password }

        const login = await server.inject({
            method: 'post',
            url: '/users/login',
            payload: payload_login
        })

        expect(login.statusCode).to.equal(200)
        const response = JSON.parse(login.payload)
        expect(response.token).to.exist();

        const getAll = await server.inject({
            method: 'get',
            url: '/userss',
        })

        expect(getAll.statusCode).to.equal(404)
    })

    // it('400 not found for empty database', async () => {

    //     const result = await server.inject({
    //         method: 'post',
    //         url: '/users/login',
    //         payload: {
    //             email: 'absent@example.com',
    //             password: 'StrongPass#9'
    //         }
    //     });

    //     expect(result.statusCode).to.equal(400);

    //     const login = JSON.parse(result.payload);

    //     expect(login.error).to.equal('User not found');

    //     // ensure token is not present
    //     expect(login.token).to.not.exist();


    //     const getAll = await server.inject({
    //         method: 'get',
    //         url: '/users',

    //     })

    //     expect(getAll.statusCode).to.equal(404)

    //     const body = JSON.parse(getAll.payload);
    //     expect(body.error).to.equal('All users not found');

    // })
})