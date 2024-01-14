import request from 'supertest';
import { app } from '../../app';
it('deleting comment, only the one who did it can do it', async () =>{
const cookie = global.signin();
const {body: comment} = await request(app)
.post('/api/comments') //making a purchase only for item1
.set('Cookie', cookie)
.send({
    title: 'take',
    description: 'not',
    rating: 1,
})
.expect(201)
console.log(comment.body)
console.log(comment.id)
// cancels a purchase
await request(app)
    .delete(`/api/comments/${comment.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(204)
    console.log(comment.id)
})