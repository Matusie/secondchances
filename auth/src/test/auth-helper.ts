import request from 'supertest';
import { app } from '../app';




export const AuthHelper = async () => {
    const email = 'pbs@pbs.com';
    const password = 'password';
    const firstName= 'John';
    const lastName= 'Doe';
    const terms = true;
    const response = await request(app)
      .post('/api/users/signup')
      .send({
        firstName,
        lastName,
        terms,
        email,
        password,
      })
      .expect(201);
  
    const cookie = response.get('set-cookie');
  
      console.log(cookie);
    return cookie;
    
  };