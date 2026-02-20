'use strict';

import Lab from '@hapi/lab';
import { expect } from '@hapi/code';
import { init_test } from '../../src/server';
// import { init } from '../server';
import { Server } from '@hapi/hapi';
import { UserPayload } from '../../src/models/userTableDefinition';
import { sequelize } from '../../src/sequelize/sequelize';
import bcrypt from 'bcrypt'
import { User } from '../../src/models/userTableDefinition';
import { v4 as uuid } from 'uuid';
export const lab = Lab.script();
const { describe, it, beforeEach, afterEach } = lab;
import { uniqueEmail } from './2.createUsers.test';


describe('POST /users/login', () => {
    let server: Server;

    beforeEach(async () => {
        process.env.NODE_ENV = 'test';
        server = await init_test();

        await sequelize.query('TRUNCATE TABLE tasks RESTART IDENTITY CASCADE;').catch(() => { });
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

    it('GET ALL USERS - retrieve all the users with 200', async () => {
        const payload_login = { email: 'admin@example.com', password: 'HD0315@u' }

        const login = await server.inject({
            method: 'post',
            url: '/user/login',
            payload: payload_login
        })

        expect(login.statusCode).to.equal(200)
        const response = JSON.parse(login.payload)
        expect(response.token).to.exist();
        const token = response.token as string

        const payload = {
            name: 'Devi',
            email: uniqueEmail(),
            password: 'Divyaaa@Sheiii0315',
            role: 'User'
        } as UserPayload;

        const res = await server.inject({
            method: 'post',
            url: '/create-user',
            payload,
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        expect(res.statusCode).to.equal(201);

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

    it('GET ALL USERS - 400 not found for empty database', async () => {
        const payload_login = { email: 'admin@example.com', password: 'HD0315@u' }

        const login = await server.inject({
            method: 'post',
            url: '/user/login',
            payload: payload_login
        })

        expect(login.statusCode).to.equal(200)
        const response = JSON.parse(login.payload)
        expect(response.token).to.exist();
        const token = response.token as string

        // const delUsers = await User.destroy({where: {role: 'User'}})
        // console.log(delUsers)

        const getAll = await server.inject({
            method: 'get',
            url: '/users',
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        expect(getAll.statusCode).to.equal(404)
        const body = JSON.parse(getAll.payload);
        expect(body.error).to.equal('All users not found');
    })
})