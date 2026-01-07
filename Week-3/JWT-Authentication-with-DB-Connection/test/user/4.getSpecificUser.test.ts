// 'use strict';

// import Lab from '@hapi/lab';
// import { expect } from '@hapi/code';
// import { init_test } from '../../src/server';
// // import { init } from '../server';
// import { Server } from '@hapi/hapi';
// import { UserPayload } from '../../src/models/userTableDefinition';

// export const lab = Lab.script();
// const { describe, it, beforeEach, afterEach } = lab;  // BDD - Behavior driven development
// import { uniqueEmail } from './1.registerUser.test';


// describe('POST /users/login', () => {
//     let server: Server;

//     beforeEach(async () => {
//         server = await init_test();
//     });

//     afterEach(async () => {
//         await server.stop();
//     });

//     it('GET SPECIFIC USER - retrieve a specific user using user Id with 200', async () => {
//         const payload = {
//             name: 'Devi',
//             email: await uniqueEmail(),
//             password: 'Divyaaa@Sheiii0315',
//             age: 22
//         } as UserPayload;

//         const res = await server.inject({
//             method: 'post',
//             url: '/users/register',
//             payload
//         });

//         expect(res.statusCode).to.equal(201);
//         const reg_body = JSON.parse(res.payload)
//         expect(reg_body.userID).to.exist()
//         expect(reg_body.userID).to.be.a.number()

//         const userId: number = reg_body.userID;

//         const payload_login = { email: payload.email, password: payload.password }

//         const login = await server.inject({
//             method: 'post',
//             url: '/users/login',
//             payload: payload_login
//         })

//         expect(login.statusCode).to.equal(200)
//         const response = JSON.parse(login.payload)
//         expect(response.token).to.exist();

//         const token = response.token as string
//         const getOne = await server.inject({
//             method: 'get',
//             url: `/users/${userId}`,
//             headers: {
//                 authorization: `Bearer ${token}`
//             }
//         })

//         expect(getOne.statusCode).to.equal(200)
//         const body = JSON.parse(getOne.payload)
//         expect(body.user).to.exist()
//     })


//     it('GET SPECIFIC USER - Invalid path with 404 not found error', async () => {
//         const payload = {
//             name: 'Devi',
//             email: await uniqueEmail(),
//             password: 'Divyaaa@Sheiii0315',
//             age: 22
//         } as UserPayload;

//         const res = await server.inject({
//             method: 'post',
//             url: '/users/register',
//             payload
//         });

//         expect(res.statusCode).to.equal(201);

//         const payload_login = { email: payload.email, password: payload.password }

//         const login = await server.inject({
//             method: 'post',
//             url: '/users/login',
//             payload: payload_login
//         })

//         expect(login.statusCode).to.equal(200)
//         const response = JSON.parse(login.payload)
//         expect(response.token).to.exist();

//         const token = response.token as string
//         const getOne = await server.inject({
//             method: 'get',
//             url: '/users{id}',
//             headers: {
//                 authorization: `Bearer ${token}`
//             }
//         })

//         expect(getOne.statusCode).to.equal(404)
//     })


//     it('GET SPECIFIC USER - 401 Unauthorized, missing bearer token ', async () => {
//         const payload = {
//             name: 'Devi',
//             email: await uniqueEmail(),
//             password: 'Divyaaa@Sheiii0315',
//             age: 22
//         } as UserPayload;

//         const res = await server.inject({
//             method: 'post',
//             url: '/users/register',
//             payload
//         });

//         expect(res.statusCode).to.equal(201);
//         const reg_body = JSON.parse(res.payload)
//         const userId: number = reg_body.userID;

//         const payload_login = { email: payload.email, password: payload.password }

//         const login = await server.inject({
//             method: 'post',
//             url: '/users/login',
//             payload: payload_login
//         })

//         expect(login.statusCode).to.equal(200)
//         const response = JSON.parse(login.payload)
//         expect(response.token).to.exist();

//         const getOne = await server.inject({
//             method: 'get',
//             url: `/users/${userId}`
//         })

//         expect(getOne.statusCode).to.equal(401)
//     })


//     it('GET SPECIFIC USER - 404 when a specifuc user is not found', async () => {
//         const payload = {
//             name: 'Devi',
//             email: await uniqueEmail(),
//             password: 'Divyaaa@Sheiii0315',
//             age: 22
//         } as UserPayload;

//         const res = await server.inject({
//             method: 'post',
//             url: '/users/register',
//             payload
//         });

//         expect(res.statusCode).to.equal(201);

//         const payload_login = { email: payload.email, password: payload.password }

//         const login = await server.inject({
//             method: 'post',
//             url: '/users/login',
//             payload: payload_login
//         })

//         expect(login.statusCode).to.equal(200)
//         const response = JSON.parse(login.payload)
//         expect(response.token).to.exist();

//         const token = response.token as string
//         const getOne = await server.inject({
//             method: 'get',
//             url: `/users/784`,  // isActive = false
//             headers: {
//                 authorization: `Bearer ${token}`
//             }
//         })

//         expect(getOne.statusCode).to.equal(404)
//         const get_body = JSON.parse(getOne.payload)
//         expect(get_body.error).to.equal('User not found or already deleted')
//     })


//     it('GET SPECIFIC USER - 500 Internal server Error with invalid path parameter', async () => {
//         const payload = {
//             name: 'Devi',
//             email: await uniqueEmail(),
//             password: 'Divyaaa@Sheiii0315',
//             age: 22
//         } as UserPayload;

//         const res = await server.inject({
//             method: 'post',
//             url: '/users/register',
//             payload
//         });

//         expect(res.statusCode).to.equal(201);

//         const payload_login = { email: payload.email, password: payload.password }

//         const login = await server.inject({
//             method: 'post',
//             url: '/users/login',
//             payload: payload_login
//         })

//         expect(login.statusCode).to.equal(200)
//         const response = JSON.parse(login.payload)
//         expect(response.token).to.exist();

//         const token = response.token as string
//         const getOne = await server.inject({
//             method: 'get',
//             url: `/users/{userId}`,
//             headers: {
//                 authorization: `Bearer ${token}`
//             }
//         })

//         expect(getOne.statusCode).to.equal(500)
//     })
// })