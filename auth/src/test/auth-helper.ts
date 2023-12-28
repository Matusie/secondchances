import request from 'supertest';
import { app } from '../app';




export const AuthHelper = async () => {
    const email = 'pbs@pbs.com';
    const password = 'password';
  
    const response = await request(app)
      .post('/api/users/signup')
      .send({
        email,
        password,
      })
      .expect(201);
  
    const cookie = response.get('set-cookie');
  
      console.log(cookie);
    return cookie;
    
  };