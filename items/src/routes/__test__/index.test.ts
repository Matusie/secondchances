import  request  from "supertest";
import { app } from '../../app';
jest.mock('../../nats-wrapper');
it('fetching a list of items id', async () =>{
    await request(app)
    .post('/api/items')
    .set('Cookie', global.signin())
    .send({
        title:'cokolwiek',
        price:123
    });
    await request(app)
    .post('/api/items')
    .set('Cookie', global.signin())
    .send({
        title:'cokolwiek',
        price:123
    });
    await request(app)
    .post('/api/items')
    .set('Cookie', global.signin())
    .send({
        title:'cokolwiek',
        price:123
    });

const response = await request(app)
    .get('/api/items')
    .send()
    .expect(200);
console.log(response)
})