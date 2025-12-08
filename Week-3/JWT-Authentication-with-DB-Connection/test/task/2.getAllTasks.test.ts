import Lab from '@hapi/lab';
import { expect } from '@hapi/code';
import { init_test } from '../../src/server';
import { Server } from '@hapi/hapi';
import { UserPayload } from '../../src/models/userTableDefinition';
import { uniqueEmail } from '../user/1.registerUser.test';

export const lab = Lab.script();
const { describe, it, beforeEach, afterEach } = lab;  // BDD - Behavior driven development

describe('POST /tasks', () => {
    let server: Server;

    beforeEach(async () => {
        server = await init_test();
    });

    afterEach(async () => {
        await server.stop();
    });

    
    it('GET ALL TASKS - 200 when retrieved all users', async () => {
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

        const token = response.token as string

        const task_payload = {
            taskName: 'testing',
            description: 'manual',
            createdBy: 3
        }

        // console.log("Payload: ", payload)
        const task_res = await server.inject({
            method: 'post',
            url: '/tasks',
            payload: task_payload
        });

        expect(task_res.statusCode).to.equal(201);

        const getAllRes = await server.inject({
            method: 'get',
            url: '/tasks',
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        expect(getAllRes.statusCode).to.equal(200)
        const body = JSON.parse(getAllRes.payload)
        expect(body.tasks).to.exist()
    });



    it('GET ALL TASKS - 401 when Unauthorized', async () => {
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

        const token = response.token as string

        const task_payload = {
            taskName: 'testing',
            description: 'manual',
            createdBy: 3
        }

        // console.log("Payload: ", payload)
        const task_res = await server.inject({
            method: 'post',
            url: '/tasks',
            payload: task_payload
        });

        expect(task_res.statusCode).to.equal(201);

        const getAllRes = await server.inject({
            method: 'get',
            url: '/tasks'
        });

        expect(getAllRes.statusCode).to.equal(401)
    });


    it('GET ALL TASKS - 404 when invalid endpoint', async () => {
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

        const token = response.token as string

        const task_payload = {
            taskName: 'testing',
            description: 'manual',
            createdBy: 3
        }

        // console.log("Payload: ", payload)
        const task_res = await server.inject({
            method: 'post',
            url: '/tasks',
            payload: task_payload
        });

        expect(task_res.statusCode).to.equal(201);

        const getAllRes = await server.inject({
            method: 'get',
            url: '/taskssss',
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        expect(getAllRes.statusCode).to.equal(404)
    });

});


