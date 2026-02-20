'use strict';

import Lab from '@hapi/lab';
import { expect } from '@hapi/code';
import { Server } from '@hapi/hapi';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid'
import { init_test } from '../../src/server';
import { User } from '../../src/models/userTableDefinition';
import { sequelize } from '../../src/sequelize/sequelize';

export const lab = Lab.script();
const { describe, it, beforeEach, afterEach } = lab;

describe('POST /users/login', () => {
    let server: Server;

    beforeEach(async () => {
        process.env.NODE_ENV = 'test';
        server = await init_test();

        await sequelize.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE;');
        await sequelize.query('TRUNCATE TABLE tasks RESTART IDENTITY CASCADE;').catch(() => { });

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

    it('should return 200 + token for correct credentials', async () => {
        const payload_login = { email: 'admin@example.com', password: 'HD0315@u' }
        const res = await server.inject({
            method: 'POST',
            url: '/user/login',
            payload: payload_login
        });

        expect(res.statusCode).to.equal(200);
        const response = JSON.parse(res.payload);

        const token = response.token as string

        const createdUser = await User.create({
            userId: uuid(),
            name: 'janani',
            email: 'janani@example.com',
            role: 'User',
            password: await bcrypt.hash('HD0315@u', 10),
        });

        const task_payload = {
            taskName: 'testing',
            description: 'manual',
            assignedTo: createdUser.userId
        }

        const task_res = await server.inject({
            method: 'post',
            url: '/create-tasks',
            payload: task_payload,
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        expect(task_res.statusCode).to.equal(201);
        const body = JSON.parse(task_res.payload);
        expect(body.taskId).to.exist()
        expect(body.taskId).to.be.a.string();
    });
});