import request from 'supertest';
import {app} from '../../app';
import crypto from 'crypto';
import { cookie } from 'express-validator';
import mongoose from 'mongoose';
import { Item } from '../../models/item';
import { natsWrapper } from '../../nats-wrapper';

jest.mock('../../nats-wrapper');
test('Error 404 jezeli id nie istnieje', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    //const id = crypto.randomBytes(12).toString("hex")
await request(app)
    .put(`/api/items/${id}`)
    .set('Cookie', global.signin()) //here we are making sure we are loggedin, because we posses cookie, for sure we are
    .send({ 
        title: '123',
        price: 20
    }) // basically .send is providing info
     .expect(404);  
});

test('Error 401 jezeli user nie jest autoryzowany', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    //const id = crypto.randomBytes(12).toString("hex")
    await request(app)
        .put(`/api/items/${id}`)
        .send({  //jak widac, tutaj juz ie pytamy o Cookie, wiec nie jestesmy autenticated
            title: 'cokolwiek',
            price: 20
        }) // basically .send is providing info
         .expect(401); 
});

test('Error 401 jezeli user nie posiada itema', async () => {
const response = await request(app) //const response = makes capturing the response of the id we just generated
    .post('/api/items')
    .set('Cookie', global.signin())
    .send({
        title: 'cokolwiek',
        price: 20
    });
    await request(app)
    .put(`/api/items/${response.body.id}`) //because we captured it, now we can call it
    .set('Cookie', global.signin()) //now we are trying to be seen as different user!
    .send({
        title: 'wdwada',
        price: 1000
    })
    .expect(401);
    console.log(response.body.title)
    console.log(response.body.price) // we are making sure that we used the global for different user
}); 

test('Error 400 jezeli podaje zla cene', async () => {
    const response = await request(app) //const response = makes capturing the response of the id we just generated
    .post('/api/items')
    .set('Cookie', global.signin())
    .send({
        title: 'test',
        price: -10
    })
    .expect(400);

});

test('Error 400 jezeli podaje zla nazwe', async () => {
    const response = await request(app) //const response = makes capturing the response of the id we just generated
    .post('/api/items')
    .set('Cookie', global.signin())
    .send({
        title: '',
        price: 20
    })
    .expect(400);

});

test('Error 400 jezeli nie podaje ceny', async () => {
    const response = await request(app) //const response = makes capturing the response of the id we just generated
    .post('/api/items')
    .set('Cookie', global.signin())
    .send({
        title: 'cokolwiek',
    })
    .expect(400);
});

test('Error 400 jezeli nie podaje nazwy', async () => {
    const response = await request(app) //const response = makes capturing the response of the id we just generated
    .post('/api/items')
    .set('Cookie', global.signin())
    .send({
        price: 20
    })
    .expect(400);
});
test('Aktualizuje item z dobrymi wartosciami', async () => {
    const cookie = global.signin()[0];

    const response = await request(app)
      .post('/api/items')
     .set('Cookie', cookie)
      .send({
        title: 'asldkfj',
        price: 20,
      });
      console.log(response.body.id);
  console.log(cookie);
    await request(app)
        .put(`/api/items/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
        title: 'new title',
        price: 100,
      })
      .expect(200);
      console.log(cookie);
    const itemResponse = await request(app)
      .get(`/api/items/${response.body.id}`)
      .send();
      console.log(itemResponse.status)
      console.log(cookie);
    expect(itemResponse.body.price).toEqual(100);
    //expect(ItemResponse.body.price).toEqual(100);
  });
  test('Mock test', async () => {
    const cookie = global.signin()[0];

    const response = await request(app)
      .post('/api/items')
     .set('Cookie', cookie)
      .send({
        title: '1234',
        price: 20,
      });
  console.log(cookie);
  const response2 = await request(app)
        .put(`/api/items/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
        title: 'nowy',
        price: 100,
      })
      .expect(200);
      console.log(response.body.id);
      console.log(response2.body.id);
      expect(natsWrapper.client.publish).toHaveBeenCalled();
    });

test("reserved item", async () =>{
    const cookie = global.signin()[0];

    const response = await request(app)
      .post('/api/items')
     .set('Cookie', cookie)
      .send({
        title: '1234',
        price: 20,
      });
      //adding purchaseId
 const item = await Item.findById(response.body.id);
 item!.set({purchaseId:  new mongoose.Types.ObjectId().toHexString()});
 await item!.save();
  await request(app)
        .put(`/api/items/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
        title: 'nowy',
        price: 100,
      })
      .expect(400);
})
