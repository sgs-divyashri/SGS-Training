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

    
    it('SOFT DELETE TASK - 200 when retrieved a specific task', async () => {
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
        const reg_body = JSON.parse(task_res.payload)
        expect(reg_body.taskId).to.be.a.string()
        const taskID: string = reg_body.taskId;

        const softDelete = await server.inject({
            method: 'delete',
            url: `/tasks/${taskID}`,
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        expect(softDelete.statusCode).to.equal(200)
        const body = JSON.parse(softDelete.payload)
        expect(body.task).to.exist()
    });



    it('GET SPECIFIC TASK - 401 when Unauthorized', async () => {
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
        const reg_body = JSON.parse(task_res.payload)
        expect(reg_body.taskId).to.be.a.string()
        const taskID: string = reg_body.taskId;

        const softDelete = await server.inject({
            method: 'delete',
            url: `/tasks/${taskID}`
        });

        expect(softDelete.statusCode).to.equal(401)
    });


    it('SOFT DELETE TASK - 404 when invalid endpoint', async () => {
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
        const reg_body = JSON.parse(task_res.payload)
        expect(reg_body.taskId).to.be.a.string()
        const taskID: string = reg_body.taskId;

        const softDelete = await server.inject({
            method: 'DELETE',
            url: `/taskss/${taskID}`,
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        expect(softDelete.statusCode).to.equal(404)
    });


    it('SOFT DELETE TASK - 400 Bad Request, invalid Task ID in path parameter', async () => {
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
        const reg_body = JSON.parse(task_res.payload)
        expect(reg_body.taskId).to.be.a.string()
        const taskID: string = 'TTT';

        const softDelete = await server.inject({
            method: 'DELETE',
            url: `/taskss/${taskID}`,
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        expect(softDelete.statusCode).to.equal(404)
    });

});
