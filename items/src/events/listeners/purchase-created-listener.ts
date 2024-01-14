import { Message } from 'node-nats-streaming';
import { Subjects, Listener, PurchaseCreatedEvent} from '@secondchances/common';
import { Item } from '../../models/item';
import { ItemUpdatedPublisher } from '../publishers/item-updated-publisher';
// as always, extending generic class means we need to provide type of an event we are listing  for
export class PurchaseCreatedListener extends Listener<PurchaseCreatedEvent>{
    // forcing double security to never change that value
    subject: Subjects.PurchaseCreated = Subjects.PurchaseCreated;
    //queueGroup is making the actual round robin, sending event just to ONE service
    //its based on the subscription
    queueGroupName = 'purchases-service';
//type data checking that are consisted  in ItemCreatedEvent
//message is an object coming from NATS that gives us a lot of info how data should be proccesed
//in our case we need to look for ack():void; so we send info just once sucessfully
    async onMessage(data: PurchaseCreatedEvent['data'], msg: Message){
        //finding the ticket
        const item = await Item.findById(data.item.id);
        //if no, throw eerror
        if(!item){
            throw new Error('Nie ma takiego przedmiotu')
        }
        item.set({purchaseId: data.id});
        //save the ticket
        await item.save();
        await new ItemUpdatedPublisher(this.client).publish({
            id: item.id,
            price: item.price,
            title: item.title,
            userId: item.userId,
            description: item.description ?? '',
            avatar: item.avatar ?? '',
        });
        //ack
        msg.ack();
    }
        
    }