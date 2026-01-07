import Lab from '@hapi/lab';
import { expect } from '@hapi/code';
import { init_test } from '../../src/server';
// import { init } from '../server';
import { Server } from '@hapi/hapi';
import { taskRepository } from '../../src/repository/taskRepo';
import { UserPayload } from '../../src/models/userTableDefinition';
import { uniqueEmail } from '../user/1.registerUser.test';

export const lab = Lab.script();
const { describe, it, beforeEach, afterEach } = lab; 

describe('POST /tasks', () => {
    let server: Server;

    beforeEach(async () => {
        server = await init_test();
    });

    afterEach(async () => {
        await server.stop();
    });

    // Create a user with Valid payload (name, email, password, age)
    it('201 when CREATE A NEW TASK', async () => {
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
            payload: task_payload,
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        expect(task_res.statusCode).to.equal(201);
        const body = JSON.parse(task_res.payload);
        expect(body.taskId).to.exist()
        expect(body.taskId).to.be.a.string();
        const task = await taskRepository.getSpecificTask(body.taskId)
        expect(task).to.exist()
        // expect()
    });


    // Missing payload properties - desc, created by
    it('CREATE A NEW TASK fails with 400 when payload is invalid', async () => {
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

        const badPayload = {
            taskName: 'software'
            // missing description, createdBy
        };

        // console.log("Payload: ", payload)
        const task_res = await server.inject({
            method: 'post',
            url: '/tasks',
            payload: badPayload,
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        expect(task_res.statusCode).to.equal(400);
        const body = JSON.parse(task_res.payload);
        expect(body.error).to.equal('TaskName, Description and CreatedBy are required');
    });

    // invalid user id input type
    it('CREATE A NEW TASK fails with 400 when user ID is invalid', async () => {
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

        const badPayload = {
            taskName: 'testing',
            description: 'manual',
            createdBy: 'hi'
        };

        // console.log("Payload: ", payload)
        const task_res = await server.inject({
            method: 'post',
            url: '/tasks',
            payload: badPayload,
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        expect(task_res.statusCode).to.equal(400)
        const body = JSON.parse(task_res.payload);
        expect(body.error).to.equal('Invalid input type for createdBy');
    });

});


