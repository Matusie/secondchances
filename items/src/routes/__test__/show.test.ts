import  request  from "supertest";
import { app } from '../../app';
import mongoose from "mongoose";
jest.mock('../../nats-wrapper');
it('returns a 404 if the item is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    //const uniqid = Date.now();
    await request(app)
    .get(`/api/items/${id}`)
    .send()
    .expect(404);
    //console.log(uniqid)
});