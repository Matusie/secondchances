import mongoose from 'mongoose';
import request from 'supertest';
import { PurchaseStatus } from '@secondchances/common';
import { app } from '../../app';
import { Purchase } from  '../../models/purchase';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';

it('returns a 404 when purchasing an Purchase that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'asldkfj',
      PurchaseId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('returns a 401 when purchasing an Purchase that doesnt belong to the user', async () => {
  const purchase = Purchase.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    status: PurchaseStatus.Created,
  });
  await purchase.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'asldkfj',
      PurchaseId: purchase.id,
    })
    .expect(401);
});

it('returns a 400 when purchasing a cancelled Purchase', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const purchase = Purchase.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    price: 20,
    status: PurchaseStatus.Cancelled,
  });
  await purchase.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      purchaseId: purchase.id,
      token: 'asdlkfj',
    })
    .expect(400);
});

it('returns a 201 with valid inputs', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000);
  const purchase = Purchase.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    price,
    status: PurchaseStatus.Created,
  });
  await purchase.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'tok_visa',
      purchaseId: purchase.id,
    })
    .expect(201);

  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find((charge) => {
    return charge.amount === price * 100;
  });

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual('pln');

  const payment = await Payment.findOne({
    purchaseId: purchase.id,
    stripeId: stripeCharge!.id,
  });
  expect(payment).not.toBeNull();
});