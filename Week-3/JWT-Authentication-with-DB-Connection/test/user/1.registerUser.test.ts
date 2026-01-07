// import Lab from '@hapi/lab';
// import { expect } from '@hapi/code';
// import { init_test } from '../../src/server';
// // import { init } from '../server';
// import { Server } from '@hapi/hapi';
// import { User, UserPayload } from '../../src/models/userTableDefinition';
// import { sequelize } from '../../src/sequelize/sequelize';
// import { userRepository } from '../../src/repository/userRepo';

// export const lab = Lab.script();
// const { describe, it, beforeEach, afterEach } = lab;  // BDD - Behavior driven development

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

// describe('POST /users/register', () => {
//   let server: Server;

//   beforeEach(async () => {
//     server = await init_test();
//   });

//   afterEach(async () => {
//     await server.stop();
//   });

//   // Create a user with Valid payload (name, email, password, age)
//   it('REGISTER USER - creates a user and responds with 201', async () => {
//     const payload = {
//       name: 'Devi',
//       email: uniqueEmail(),
//       password: 'DeviiiHari32476r8@HI',
//       age: 22
//     } as UserPayload;

//     console.log("Payload: ", payload)
//     const res = await server.inject({
//       method: 'post',
//       url: '/users/register',
//       payload
//     });

//     expect(res.statusCode).to.equal(201);
//     const body = JSON.parse(res.payload);
//     expect(body.userID).to.exist()
//     expect(body.userID).to.be.a.number();
//     const user = await userRepository.getSpecificUser(body.userID)
//     expect(user).to.exist()
//   });


//   // Missing payload properties - name, age
//   it('REGISTER USER - fails with 400 when payload is invalid', async () => {
//     const badPayload = {
//       email: uniqueEmail()
//       // missing name, age & password
//     };

//     const res = await server.inject({
//       method: 'post',
//       url: '/users/register',
//       payload: badPayload
//     });

//     expect(res.statusCode).to.equal(400);
//     const body = JSON.parse(res.payload);
//     expect(body.error).to.equal('Bad Request');
//   });


//   // Verify email pattern using regex
//   it('REGISTER USER - fails with 400 when email pattern is invalid', async () => {
//     const badPayload = {
//       email: 'deeeeepssssss-gil.com',
//       name: 'Deepika',
//       password: 'S3cret@123',
//       age: 27
//     };

//     const res = await server.inject({
//       method: 'post',
//       url: '/users/register',
//       payload: badPayload
//     });

//     expect(res.statusCode).to.equal(400);
//     const body = JSON.parse(res.payload);
//     expect(body.error).to.equal('Invalid email format');
//   });

//   // Cannot add duplicate emails
//   it('REGISTER USER - fails with 409 when email already exists', async () => {
//     const payload = {
//       email: 'test@example.com',
//       name: 'Divyaaa',
//       password: 'StrongPass#9',
//       age: 23
//     };

//     const res = await server.inject({
//       method: 'post',
//       url: '/users/register',
//       payload
//     });

//     expect(res.statusCode).to.equal(409);
//     const body = JSON.parse(res.payload);
//     expect(body.error).to.equal('Email already registered');
//   });

//   it('REGISTER USER - fails with 400 when violated password policy', async () => {
//     const payload = {
//       name: 'Devi',
//       email: uniqueEmail(),
//       password: 'dis bkjdb',
//       age: 22
//     } as UserPayload;

//     console.log("Payload: ", payload)
//     const res = await server.inject({
//       method: 'post',
//       url: '/users/register',
//       payload
//     });

//     expect(res.statusCode).to.equal(400);
//   });


//   // check hashing password correctly
//   it('REGISTER USER - created with 201 when hashing password is successful', async () => {
//     const payload = {
//       email: uniqueEmail(),
//       name: 'Devi',
//       password: 'StrongPass#9',
//       age: 25
//     };

//     const res = await server.inject({
//       method: 'post',
//       url: '/users/register',
//       payload
//     });

//     expect(res.statusCode).to.equal(201);
//     const body = JSON.parse(res.payload);
//     expect(body.userID).to.exist();
//     expect(body.userID.password).to.not.exist();
//     // Read back from DB and verify the hash
//     const saved = await User.findOne({ where: { email: payload.email } });
//     expect(saved).to.exist();
//     expect(saved?.password).to.not.equal(payload.password)
//     const user = await userRepository.getSpecificUser(body.userID)
//     expect(user).to.exist()
//   });
// });


