import { Subjects, Listener, PurchaseCancelledEvent} from '@secondchances/common';
import { Item } from '../../models/item';
import { Message } from 'node-nats-streaming';
import { ItemUpdatedPublisher } from '../publishers/item-updated-publisher';
export class PurchaseCancelledListener extends Listener<PurchaseCancelledEvent>{
    subject: Subjects.PurchaseCancelled = Subjects.PurchaseCancelled;
    queueGroupName = 'purchases-service';
    async onMessage(data: PurchaseCancelledEvent['data'], msg: Message){
        const item = await Item.findById(data.item.id);
        if(!item){
            throw new Error('Nie ma takiego przedmiotu');
        }
        item.set({purchaseId: undefined });
        await item.save();
        await new ItemUpdatedPublisher(this.client).publish({
            id: item.id,
            //purchaseId: item.purchaseId,
            userId: item.userId,
            price: item.price,
            title: item.title,
        });
    }
}