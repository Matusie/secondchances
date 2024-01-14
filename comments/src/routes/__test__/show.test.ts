import request from 'supertest';
import { app } from '../../app';
it('showing certain comment, doesnt matter who did it', async () =>{
const cookie = global.signin();
const cookie2 = global.signin();
const {body: comment} = await request(app)
.post('/api/comments') //making a purchase only for item1
.set('Cookie', cookie)
.send({
    title: 'showing',
    description: 'test',
    rating: 1,
})
.expect(201)


await request(app)
    .get(`/api/comments/${comment.id}`)
    .set('Cookie', cookie2)
    .send()
    .expect(200)
    console.log(comment.id)
})