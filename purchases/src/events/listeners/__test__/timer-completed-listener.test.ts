import { Item } from '../../../models/item'
import { Message } from 'node-nats-streaming';
import { Purchase } from "../../../models/purchase";
import { natsWrapper } from "../../../nats-wrapper";
import { TimerCompletedListener } from '../timer-completed-listener';
import { TimerCompletedEvent, PurchaseStatus } from '@secondchances/common';
import mongoose from 'mongoose';
const setup = async () => {
    const listener = new TimerCompletedListener(natsWrapper.client);
    const item = Item.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'gowno',
        price: 2137
    });
    await item.save();
    const purchase = Purchase.build({
        status: PurchaseStatus.Created,
        userId: 'cokolwiek',
        expiresAt: new Date(),
        item,
    });
    await purchase.save();
    const data: TimerCompletedEvent['data'] = {
        purchaseId: purchase.id
    };
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };
    return {listener, purchase, item, data, msg};
}
test('updateds to cancelled', async () =>{
    const {listener, purchase, item, data, msg} = await setup();
    await listener.onMessage(data,msg);
    const updatedPurchase = await Purchase.findById(purchase.id);
    expect(updatedPurchase!.status).toEqual(PurchaseStatus.Cancelled);
})
test('emits cancelled event', async () =>{
    const {listener, purchase, item, data, msg} = await setup();
    await listener.onMessage(data,msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(eventData.id).toEqual(purchase.id);
})
test('ack the message', async () =>{
    const {listener, purchase, item, data, msg} = await setup();
    await listener.onMessage(data,msg);
    expect(msg.ack).toHaveBeenCalled();
})