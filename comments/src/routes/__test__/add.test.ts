import request from 'supertest';
import { app } from '../../app';

jest.mock('../../nats-wrapper');
it('adding comment', async () => {
    await request(app)
    .post('/api/comments')
    .set('Cookie', global.signin())
    .send({
        title: 'take',
        description: 'not',
        userId: '1234',
        rating: 1,
    })
    .expect(201);

  await request(app)
    .post('/api/comments')
    .set('Cookie', global.signin())
    .send({
        title: 'take',
        description: 'not',
        userId: '1234',
        rating: 1,
    })
    .expect(201);
});