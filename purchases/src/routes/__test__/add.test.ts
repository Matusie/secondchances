import request from 'supertest';
import {app} from "../../app";
import mongoose from 'mongoose';
import {Purchase, PurchaseStatus} from "../../models/purchase";
import {Item} from "../../models/item";
//make test of auth, validation etc, remeber!
import { natsWrapper } from '../../nats-wrapper';
test('item does not exist', async () => {
    const itemId= new mongoose.Types.ObjectId(); //creating a new one literally
    await request(app)
    .post('/api/purchases')
    .set('Cookie', global.signin())
    .send({itemId})
    .expect(404);
})

test('already reserved', async () => {
const item = Item.build({ //first building item and saving it to the database
    id: '123',
    title: 'barka',
    price: 2137
});
    await item.save(); //makiing a purchase and saving it to db
    const purchase = Purchase.build({
        item: item,
        userId: '12345',
        status: PurchaseStatus.Created,
        expiresAt: new Date() //now shows it gonna expires instantly
    })
    await purchase.save();
    // trying to purchase
    await request(app)
    .post('/api/purchases')
    .set('Cookie', global.signin())
    .send({itemId: item.id})
    .expect(400);
});

test('making reservation', async () =>{
    const item = Item.build({ 
        id: '123',
        title: 'barka',
        price: 2137
    });
        await item.save();
        await request(app)
    .post('/api/purchases')
    .set('Cookie', global.signin())
    .send({itemId: item.id})
    .expect(201);
});

test('fetching info for current user', async () =>{
    //creating two items to show that there are ones that are not included
    const user = global.signin();
    const user2 = global.signin(); //second user to show that he can't see
    const item1 = Item.build({
        id: '123',
        title: 'kremowka',
        price: 7312
    })
    const item2 = Item.build({ 
        id: '123',
        title: 'barka',
        price: 2137
    });
        await item1.save();
        await item2.save();
        await request(app)
    .post('/api/purchases') //making a purchase only for item1
    .set('Cookie', user)
    .send({itemId: item1.id})
    .expect(201);
        await item1.save();
        const response = await request(app)
        .get(`/api/purchases`)
        .set('Cookie', user)
        .expect(200);

        console.log(response.body);

    //    //fetching certain purchase DOES indeed works now
    //     console.log(response.body.id)
    //     const response2 = await request(app)
    //     .get(`/api/purchases/${response.body.id}`)
    //     .set('Cookie', user)
    //     .send()
    //     .expect(200);
    //     console.log(item1.id);
    //     console.log(response2.body.id);

        // SHOWING THAT USER2 CAN'T SEE
        const response3 = await request(app)
        .get(`/api/purchases`)
        .set('Cookie', user2)
        .expect(200);

        console.log(response3.body);


});
test('canceling', async () =>{
    //creating an item
    const user = global.signin(); 
    const item1 = Item.build({
        id: '123',
        title: 'kremowka',
        price: 7312
    })
        await item1.save();
    //creating an purchase
    const {body: purchase} = await request(app)
    .post('/api/purchases') //making a purchase only for item1
    .set('Cookie', user)
    .send({itemId: item1.id})
    .expect(201);
console.log(purchase.status)
    // cancels a purchase
await request(app)
        .delete(`/api/purchases/${purchase.id}`)
        .set('Cookie', user)
        .send()
        .expect(204)
 
        
    // checking status
    const changedPurchase = await Purchase.findById(purchase.id);


    expect(changedPurchase!.status).toEqual(PurchaseStatus.Cancelled);
});
test('publishing created event and THEN deleting it', async () =>{
    const user = global.signin();
    const item1 = Item.build({
        id: '123',
        title: 'kremowka',
        price: 7312
    })
        await item1.save();
        const {body: purchase}= await request(app)
    .post('/api/purchases') //making a purchase only for item1
    .set('Cookie', user)
    .send({itemId: item1.id})
    .expect(201);
//we can only test with not have been called or been called, the natsWrapperhandler with mock fucntion    
expect(natsWrapper.client.publish).toHaveBeenCalled();
//deleteing it, seeing if there is an event    
await request(app)
        .delete(`/api/purchases/${purchase.id}`)
        .set('Cookie', user)
        .send()
        .expect(204);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});