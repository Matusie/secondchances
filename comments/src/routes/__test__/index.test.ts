import request from 'supertest';
import { app } from '../../app';

it('fetching a list of comments id WITH ONE USER', async () =>{
    const cookie = global.signin();
    await request(app)
    .post('/api/comments')
    .set('Cookie', cookie)
    .send({
        title: 'tshirt',
        description: 'zajebisty',
        rating: 5,
    })
    await request(app)
    .post('/api/comments')
    .set('Cookie',cookie)
    .send({
        title: 'bluza',
        description: 'chujowa',
        rating: 2,
    })
    await request(app)
    .post('/api/comments')
    .set('Cookie', cookie)
    .send({
        title: 'buty',
        description: 'takie se',
        rating: 3,
    })
const response = await request(app)
    .get('/api/comments')
    .send()
    .expect(200);
console.log(response.body)
})