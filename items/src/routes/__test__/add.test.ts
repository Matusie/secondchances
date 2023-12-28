import request from 'supertest';
import { app } from '../../app';
import { Item } from '../../models/item';
import { natsWrapper } from '../../nats-wrapper';
//we are adding jest.mock to fake implementation of stan, so it can initialize NATS
jest.mock('../../nats-wrapper');
it('has a route handler listening to /api/items for post request', async () => { //shwoing that without the cookie you have the ghandler but can;t access without cookie
  const response = await request(app)
        .post('/api/items')
        .send({
          title: 'x',
          price: 20,
        });
console.log(response.status);
    expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
    const response = await request(app)
    .post('/api/items')
    .send({})
    .expect(401);
    
});
it('401 if the user is signed in', async () => {
    const cookie = global.signin();
    const response = await request(app)
    .post('/api/items')
    .set('Cookie', cookie)
    .send({});

  expect(response.status).not.toEqual(401);
})

it('returns an error if an invalid title is provided', async () => {
    await request(app)
    .post('/api/items')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 20,
    })
    .expect(400);

  await request(app)
    .post('/api/items')
    .set('Cookie', global.signin())
    .send({
      price: 20,
    })
    .expect(400);
});

it('returns an error if an invalid price is provided', async () => {
    await request(app)
      .post('/api/items')
      .set('Cookie', global.signin())
      .send({
        title: 'abcd',
        price: 0,
      })
      .expect(400);
  
    await request(app)
      .post('/api/items')
      .set('Cookie', global.signin())
      .send({
        title: 'zxcvb',
      })
      .expect(400);
  });
  
  it('creates an item with valid inputs', async () => {
    let items = await Item.find({});
    expect(items.length).toEqual(0);
  
    const title = 'asdfgh';
  
    await request(app)
      .post('/api/items')
      .set('Cookie', global.signin())
      .send({
        title,
        price: 20,
      })
      .expect(201);
  
    items = await Item.find({});
    expect(items.length).toEqual(1);
    expect(items[0].price).toEqual(20);
    expect(items[0].title).toEqual(title);
  });
///
it('publishes an update event', async () => {
  //* Arrange
  const cookie = global.signin();

  // create an item
  const response = await request(app)
      .post('/api/items')
      .set('Cookie', cookie)
      .send({
          title: 'Test Title',
          price: 10,
      })
      .expect(201);
  //* Act
  // update item
  const response2 = await request(app)
      .put(`/api/items/${response.body.id}`)
      .set('Cookie', cookie)
      .send({
          title: 'Updated Test Title',
          price: 20,
      })
      //* Assert
      .expect(200);

  // Assert
  expect(natsWrapper.client.publish).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenNthCalledWith(
      3,
      'item:updated',
      expect.any(String),
      expect.any(Function),
  );
  expect(natsWrapper.client.publish).toHaveBeenNthCalledWith(
      3,
      'item:updated',
      `{\"id\":\"${response2.body.id}\",\"title\":\"${response2.body.title}",\"price\":${response2.body.price},\"userId\":\"${response2.body.userId}\"}`,
      expect.any(Function),
  );
});