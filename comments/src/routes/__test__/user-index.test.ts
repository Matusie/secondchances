import request from 'supertest';
import { app } from '../../app';

it('GET of comments that are done by me', async () =>{
    const user1 = global.signin();
    const user2 = global.signin();
    await request(app)
    .post('/api/comments')
    .set('Cookie', user1)
    .send({
        title: 'take',
        description: 'not',
        rating: 1,
    })
    .expect(201);
    await request(app)
    .post('/api/comments')
    .set('Cookie', user2)
    .send({
        title: 'take',
        description: 'not',
        rating: 1,
    })
    .expect(201);

        const response = await request(app)
        .get(`/api/myComments`)
        .set('Cookie', user1)
        .expect(200);

        console.log(response.body);

})