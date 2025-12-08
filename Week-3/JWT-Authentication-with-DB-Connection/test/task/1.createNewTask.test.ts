import Lab from '@hapi/lab';
import { expect } from '@hapi/code';
import { init_test } from '../../src/server';
// import { init } from '../server';
import { Server } from '@hapi/hapi';
import { User, UserPayload } from '../../src/models/userTableDefinition';
import { sequelize } from '../../src/sequelize/sequelize';

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

    // Create a user with Valid payload (name, email, password, age)
    it('201 when CREATE A NEW TASK', async () => {
        const payload = {
            taskName: 'testing',
            description: 'manual',
            createdBy: 3
        }

        console.log("Payload: ", payload)
        const res = await server.inject({
            method: 'post',
            url: '/tasks',
            payload
        });

        expect(res.statusCode).to.equal(201);
        const body = JSON.parse(res.payload);
        expect(body.taskId).to.exist()
        expect(body.taskId).to.be.a.string();
    });


    // Missing payload properties - desc, created by
    it('CREATE A NEW TASK fails with 400 when payload is invalid', async () => {
        const badPayload = {
            taskName: 'software'
            // missing description, createdBy
        };

        const res = await server.inject({
            method: 'post',
            url: '/tasks',
            payload: badPayload
        });

        expect(res.statusCode).to.equal(400);
        const body = JSON.parse(res.payload);
        expect(body.error).to.equal('TaskName, Description and createdBy are required');
    });

    // invalid user id input type
    it('CREATE A NEW TASK fails with 400 when user ID is invalid', async () => {
        const badPayload = {
            taskName: 'testing',
            description: 'manual',
            createdBy: 'hi'
        };

        const res = await server.inject({
            method: 'post',
            url: '/tasks',
            payload: badPayload
        });

        expect(res.statusCode).to.equal(400);
        const body = JSON.parse(res.payload);
        expect(body.error).to.equal('Invalid input type for createdBy');
    });

});


