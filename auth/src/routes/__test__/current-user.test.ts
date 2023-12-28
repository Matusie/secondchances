import request from 'supertest';
import { app } from '../../app';
import { AuthHelper } from '../../test/auth-helper';
test('responds with details about the current user', async () => {

    // REPLACED IN AUTH-HELPER
//   const signupResponse = await request(app)
//     .post('/api/users/signup')
//     .send({
//       email: 'pbs@pbs.com',
//       password: 'password'
//     })
//     .expect(201);
  const cookie = await AuthHelper();

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(400);

  expect(response.body.currentUser.email).toEqual('pbs@pbs.com');
});
