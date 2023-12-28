import { Message } from 'node-nats-streaming';
import { Subjects, Listener, ItemUpdatedEvent} from '@secondchances/common';
import { Item } from '../../models/item';
//same as item created, look it up
//BUT here we are focusing on finding the item we want to update

export class ItemUpdatedListener extends Listener<ItemUpdatedEvent>{
    subject: Subjects.ItemUpdated = Subjects.ItemUpdated;
    queueGroupName = 'purchases-service';
    async onMessage(data: ItemUpdatedEvent['data'], msg: Message){
      //finding the item
      // but not just one item, we are now finding if there is good ID AND good version (which is minus one)
        const item = await Item.findOne({
          _id: data.id,
          //version: data.version -1
        })

        if(!item){
            throw new Error('Item not found');
        }
        const {title,price} = data;
        item.set({title,price});
        await item.save();
        msg.ack();
    }
        
    }