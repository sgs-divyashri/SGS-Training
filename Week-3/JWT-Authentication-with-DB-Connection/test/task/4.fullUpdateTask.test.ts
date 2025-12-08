'use strict';

import Lab from '@hapi/lab';
import { expect } from '@hapi/code';
import { init_test } from '../../src/server';
// import { init } from '../server';
import { Server } from '@hapi/hapi';
import { UserPayload } from '../../src/models/userTableDefinition';

export const lab = Lab.script();
const { describe, it, beforeEach, afterEach } = lab;  // BDD - Behavior driven development
import { uniqueEmail } from '../user/1.registerUser.test';


describe('POST /users/login', () => {
    let server: Server;

    beforeEach(async () => {
        server = await init_test();
    });

    afterEach(async () => {
        await server.stop();
    });

    it('FULL UPDATE TASK - full update with all correct detail with 200', async () => {
        const payload = {
            name: 'Divya',
            email: uniqueEmail(),
            password: 'Divyaaa@Sheiii0315',
            age: 25
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

        const task_payload = {
            taskName: 'testing',
            description: 'manual',
            createdBy: 3
        }

        const task_res = await server.inject({
            method: 'post',
            url: '/tasks',
            payload: task_payload
        });

        expect(task_res.statusCode).to.equal(201);
        const task_body = JSON.parse(task_res.payload);
        const taskID: string = task_body.taskId;
        expect(task_body.taskId).to.exist()
        expect(task_body.taskId).to.be.a.string();

        const update_payload = {
            taskName: 'develop',
            description: 'software',
            createdBy: 7,
            status: "Review"
        }

        const f_update = await server.inject({
            method: 'put',
            url: `/tasks/f_update/${taskID}`,
            payload: update_payload,
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        expect(f_update.statusCode).to.equal(200)
    })


    it('FULL UPDATE TASK - fails with 400 when entered invalid/missing payload', async () => {
        const payload = {
            name: 'Divya',
            email: uniqueEmail(),
            password: 'Divyaaa@Sheiii0315',
            age: 25
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

        const task_payload = {
            taskName: 'testing',
            description: 'manual',
            createdBy: 3
        }

        const task_res = await server.inject({
            method: 'post',
            url: '/tasks',
            payload: task_payload
        });

        expect(task_res.statusCode).to.equal(201);
        const task_body = JSON.parse(task_res.payload);
        const taskID: string = task_body.taskId;
        console.log("task body: ",task_body)
        console.log("task id: ",task_body.taskId)
        expect(task_body.taskId).to.exist()
        expect(task_body.taskId).to.be.a.string();

        const update_payload = {
            taskName: 'develop',
            status: "Review"
        }

        const f_update = await server.inject({
            method: 'put',
            url: `/tasks/f_update/${taskID}`,
            payload: update_payload,
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        expect(f_update.statusCode).to.equal(400)
    })


    it('FULL UPDATE TASK - Invalid path with 404 not found error', async () => {
        const payload = {
            name: 'Divya',
            email: uniqueEmail(),
            password: 'Divyaaa@Sheiii0315',
            age: 25
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

        const task_payload = {
            taskName: 'testing',
            description: 'manual',
            createdBy: 3,
            
        }

        const task_res = await server.inject({
            method: 'post',
            url: '/tasks',
            payload: task_payload
        });

        expect(task_res.statusCode).to.equal(201);
        const task_body = JSON.parse(task_res.payload);
        const taskID: string = task_body.taskID;
        expect(task_body.taskId).to.exist()
        expect(task_body.taskId).to.be.a.string();

        const update_payload = {
            taskName: 'develop',
            description: 'manual',
            createdBy: 3,
            status: "Completed"
        }

        const f_update = await server.inject({
            method: 'put',
            url: `/tasks/${taskID}`,
            payload: update_payload,
            headers: {
                authorization: `BEARER ${token}`
            }
        })

        expect(f_update.statusCode).to.equal(404)
    })


    it('FULL UPDATE TASK - fails with 404 with invalid/deleted user ID', async () => {
        const payload = {
            name: 'Divya',
            email: uniqueEmail(),
            password: 'Divyaaa@Sheiii0315',
            age: 25
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

        const task_payload = {
            taskName: 'testing',
            description: 'manual',
            createdBy: 3
        }

        const task_res = await server.inject({
            method: 'post',
            url: '/tasks',
            payload: task_payload
        });

        expect(task_res.statusCode).to.equal(201);
        const task_body = JSON.parse(task_res.payload);
        const taskID: string = 'T220';
        expect(task_body.taskId).to.exist()
        expect(task_body.taskId).to.be.a.string();

        const update_payload = {
            taskName: 'develop',
            description: 'dev',
            createdBy: 4,
            status: "Review"
        }

        const f_update = await server.inject({
            method: 'put',
            url: `/tasks/f_update/${taskID}`,
            payload: update_payload,
            headers: {
                authorization: `BEARER ${token}`
            }
        })

        expect(f_update.statusCode).to.equal(404)
    })



    it('FULL UPDATE TASK - 401 Unauthorized, missing bearer token', async () => {
        const payload = {
            name: 'Divya',
            email: uniqueEmail(),
            password: 'Divyaaa@Sheiii0315',
            age: 25
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

        const task_payload = {
            taskName: 'testing',
            description: 'manual',
            createdBy: 3
        }

        const task_res = await server.inject({
            method: 'post',
            url: '/tasks',
            payload: task_payload
        });

        expect(task_res.statusCode).to.equal(201);
        const task_body = JSON.parse(task_res.payload);
        const taskID: string = task_body.taskID;
        expect(task_body.taskId).to.exist()
        expect(task_body.taskId).to.be.a.string();

        const update_payload = {
            taskName: 'develop',
            description: 'dev',
            createdBy: 4,
            status: "Review"
        }

        const f_update = await server.inject({
            method: 'put',
            url: `/tasks/f_update/${taskID}`,
            payload: update_payload,
        })

        expect(f_update.statusCode).to.equal(401)
    })


    // // it('500 Internal server Error with invalid path parameter', async () => {
    // //     const payload = {
    // //         name: 'Devi',
    // //         email: await uniqueEmail(),
    // //         password: 'password123',
    // //         age: 22
    // //     } as UserPayload;

    // //     const res = await server.inject({
    // //         method: 'post',
    // //         url: '/users/register',
    // //         payload
    // //     });

    // //     expect(res.statusCode).to.equal(201);
    // //     const reg_body = JSON.parse(res.payload)
    // //     const userId: number = reg_body.user;

    // //     const payload_login = { email: payload.email, password: payload.password }

    // //     const login = await server.inject({
    // //         method: 'post',
    // //         url: '/users/login',
    // //         payload: payload_login
    // //     })

    // //     expect(login.statusCode).to.equal(200)
    // //     const response = JSON.parse(login.payload)
    // //     expect(response.token).to.exist();

    // //     const token = response.token as string
    // //     const getOne = await server.inject({
    // //         method: 'get',
    // //         url: `/users/{userId}`,
    // //         headers: {
    // //             authorization: `Bearer ${token}`
    // //         }
    // //     })

    // //     expect(getOne.statusCode).to.equal(500)
    // // })
})