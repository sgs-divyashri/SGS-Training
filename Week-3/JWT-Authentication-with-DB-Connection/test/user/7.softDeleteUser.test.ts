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

//     it('SOFT DELETE USER - soft delete user correctly with 200', async () => {
//         const payload = {
//             name: 'Divya',
//             email: uniqueEmail(),
//             password: 'Divya0315@u',
//             age: 25
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

    
//         const token = response.token as string
//         const softDelete = await server.inject({
//             method: 'delete',
//             url: `/users/${userId}`,
//             headers: {
//                 authorization: `Bearer ${token}`
//             }
//         })

//         expect(softDelete.statusCode).to.equal(200)
//         const body = JSON.parse(softDelete.payload)
//         expect(body.user).to.exist()
//     })

//     it('SOFT DELETE USER - Invalid path with 404 not found error', async () => {
//         const payload = {
//             name: 'Devi',
//             email: uniqueEmail(),
//             password: 'Divya0315@u',
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

//         const token = response.token as string
//         const softDelete = await server.inject({
//             method: 'delete',
//             url: `/usersss/${userId}`,
//             headers: {
//                 authorization: `Bearer ${token}`
//             }
//         })

//         expect(softDelete.statusCode).to.equal(404)
//     })

//     it('SOFT DELETE USER - 401 Unauthorized, missing bearer token ', async () => {
//         const payload = {
//             name: 'Devi',
//             email: await uniqueEmail(),
//             password: 'Divya0315@u',
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

//         const softDelete = await server.inject({
//             method: 'delete',
//             url: `/users/${userId}`
//         })

//         expect(softDelete.statusCode).to.equal(401)
//     })


//     it('SOFT DELETE USER - 400 Bad Request, invalid user ID in path parameter', async () => {
//         const payload = {
//             name: 'Devi',
//             email: await uniqueEmail(),
//             password: 'Divya0315@u',
//             age: 22
//         } as UserPayload;

//         const res = await server.inject({
//             method: 'post',
//             url: '/users/register',
//             payload
//         });

//         expect(res.statusCode).to.equal(201);
//         const reg_body = JSON.parse(res.payload)
//         const userId: string = "h";

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
//         const softDelete = await server.inject({
//             method: 'delete',
//             url: `/users/${userId}`,
//             headers: {
//                 authorization: `Bearer ${token}`
//             }
//         })

//         expect(softDelete.statusCode).to.equal(400)
//     })


//     // it('500 Internal server Error with invalid path parameter', async () => {
//     //     const payload = {
//     //         name: 'Devi',
//     //         email: await uniqueEmail(),
//     //         password: 'password123',
//     //         age: 22
//     //     } as UserPayload;

//     //     const res = await server.inject({
//     //         method: 'post',
//     //         url: '/users/register',
//     //         payload
//     //     });

//     //     expect(res.statusCode).to.equal(201);
//     //     const reg_body = JSON.parse(res.payload)
//     //     const userId: number = reg_body.user;

//     //     const payload_login = { email: payload.email, password: payload.password }

//     //     const login = await server.inject({
//     //         method: 'post',
//     //         url: '/users/login',
//     //         payload: payload_login
//     //     })

//     //     expect(login.statusCode).to.equal(200)
//     //     const response = JSON.parse(login.payload)
//     //     expect(response.token).to.exist();

//     //     const token = response.token as string
//     //     const getOne = await server.inject({
//     //         method: 'get',
//     //         url: `/users/{userId}`,
//     //         headers: {
//     //             authorization: `Bearer ${token}`
//     //         }
//     //     })

//     //     expect(getOne.statusCode).to.equal(500)
//     // })
// })