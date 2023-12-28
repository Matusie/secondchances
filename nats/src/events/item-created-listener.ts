import { Message } from 'node-nats-streaming';
import { Listener } from './schema-listener';
import { ItemCreatedEvent } from './item-created-event';
import { Subjects } from './subjects';

// readonly subject is the subject we want to listen to
// queueGroupName here we can see we made a Round Robin implementation.
// inside of the queteGroupName, there is eqauality of reciving messages between listeners
// misterious extending comes from that genreric type im not sure how it works
export class ItemCreatedListener extends Listener<ItemCreatedEvent> {
  readonly subject = Subjects.ItemCreated;
  queueGroupName = 'payments-service';
//Function to run when the message is received
// if everything goes right, msg is gonna be sent, if not we will let it timeout
// enforcing data type in the msg, if we gonna change anything, onMessage
  onMessage(data: ItemCreatedEvent['data'], msg: Message) {
    console.log('Event data!', data);

    console.log(data.id);
    console.log(data.title);
    console.log(data.price);
// its important to ack about reciving the message! otherwise publisher will try to deliver it anyway
    msg.ack();
  }
}
