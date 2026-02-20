import Lab from '@hapi/lab';
import { expect } from '@hapi/code';
import { init_test } from '../../src/server';
import { Server } from '@hapi/hapi';
import { User, UserPayload } from '../../src/models/userTableDefinition';
import { sequelize } from '../../src/sequelize/sequelize';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt'

export const lab = Lab.script();
const { describe, it, beforeEach, afterEach } = lab;

function generateRandomString(length: number) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charLen = chars.length
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * charLen));
    }
    return result;
}

export function uniqueEmail() {
    return `${generateRandomString(10)}@example.com`
}

describe('POST /create-user', () => {
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

    // Create a user with Valid payload (name, email, password, age)
    it('CREATE USER - admin creates a user and responds with 201', async () => {
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
            name: 'Janani',
            email: 'janani@gmail.com',
            password: 'HD0315@u',
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
        const body = JSON.parse(res.payload);
        expect(body.userID).to.exist()
        expect(body.userID).to.be.a.string();
    });

    // Missing payload properties - 
    it('CREATE USER - Missing payload with 400', async () => {
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
            email: 'janani@gmail.com',
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

        expect(res.statusCode).to.equal(400);
        const body = JSON.parse(res.payload);
        expect(body.error).to.equal('Bad Request');
    });

    // Verify email pattern using regex
    it('CREATE USER - fails with 400 when email pattern is invalid', async () => {
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
            name: 'Janani',
            email: 'jananigmail.com',
            password: 'HD0315@u',
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

        expect(res.statusCode).to.equal(400);
        const body = JSON.parse(res.payload);
        expect(body.error).to.equal('Invalid email format');
    });

    //   // Cannot add duplicate emails
    it('CREATE USER - fails with 409 when email already exists', async () => {
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
            name: 'Janani',
            email: 'janani@gmail.com',
            password: 'HD0315@u',
            role: 'User'

        } as UserPayload;

        const res1 = await server.inject({
            method: 'post',
            url: '/create-user',
            payload,
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        expect(res1.statusCode).to.equal(201);
        const body = JSON.parse(res1.payload);
        expect(body.userID).to.exist()

        const res2 = await server.inject({
            method: 'post',
            url: '/create-user',
            payload,
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        expect(res2.statusCode).to.equal(409);
        const body2 = JSON.parse(res2.payload);
        expect(body2.error).to.equal('Email already registered');
    });

    //   it('REGISTER USER - fails with 400 when violated password policy', async () => {
    it('CREATE USER - fails with 400 when violated password policy', async () => {
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
            name: 'Janani',
            email: 'janani@gmail.com',
            password: 'dytdygchu',
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

        expect(res.statusCode).to.equal(400);
        const body = JSON.parse(res.payload);
        expect(body.error).to.equal('Weak password');
    });

    it('CREATE USER - created with 201 when hashing password is successful', async () => {
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
            name: 'Janani',
            email: 'janani@gmail.com',
            password: 'HD0315@u',
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
        const body = JSON.parse(res.payload);
        expect(body.userID).to.exist()
        expect(body.userID).to.be.a.string();
        expect(body.userID.password).to.not.exist();
        const saved = await User.findOne({ where: { email: payload.email } });
        expect(saved).to.exist();
        expect(saved?.password).to.not.equal(payload.password)
    });
});


