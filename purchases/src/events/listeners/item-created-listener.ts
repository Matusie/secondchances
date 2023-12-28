import { Message } from 'node-nats-streaming';
import { Subjects, Listener, ItemCreatedEvent} from '@secondchances/common';
import { Item } from '../../models/item';
// as always, extending generic class means we need to provide type of an event we are listing  for
export class ItemCreatedListener extends Listener<ItemCreatedEvent>{
    // forcing double security to never change that value
    subject: Subjects.ItemCreated = Subjects.ItemCreated;
    //queueGroup is making the actual round robin, sending event just to ONE service
    //its based on the subscription
    queueGroupName = 'purchases-service';
//type data checking that are consisted  in ItemCreatedEvent
//message is an object coming from NATS that gives us a lot of info how data should be proccesed
//in our case we need to look for ack():void; so we send info just once sucessfully
    async onMessage(data: ItemCreatedEvent['data'], msg: Message){
        const { id, title, price, } = data;
        const item = Item.build({
            id,
            title,
            price,
        });
        await item.save();
        msg.ack();
    }
        
    }
