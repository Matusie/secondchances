import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';
//making sure that its checked that data provided has exactly data structure as wanted
interface Event {
  subject: Subjects; //saying it has to be one of the enums
  data: any;
}
//pre-initialized NATS client is the goal, so we  are messing around the Stan (which is client in NATS terminology)
// abstract subject and queue is name of which channel(subject) and group (queue) will listen
export abstract class Listener<T extends Event> { //T extends means whenever we want to change Listener, we need to provide custom type T
  abstract subject: T['subject'];
  abstract queueGroupName: string;
  abstract onMessage(data: T['data'], msg: Message): void;
  client: Stan;
  
//making sure we are using recieved the client
  constructor(client: Stan) {
    this.client = client;
  }
// SUBSCRIPTION OPTIONS
// subscriptionOptions are added because  of concurency issues,
// if we rollout update or some fail happens.
// to moderate that, we are adding options where we will:
  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable() // delivering all messages in the queue but with the Durable it is much betteer used
      .setManualAckMode(true) //acknowledgment if message is recived, so we know if we pass it to other listener or not
      .setDurableName(this.queueGroupName); //gathering information if the message was already proceesed or something, so with use of  Deliver all, we deliver only those not proccesseed
  }
//LISTENING METHOD, set up the subscription itself 
  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName, // adding queue group helps with temporary loss of the connection, it won't dump durable info
      this.subscriptionOptions()
    );
// LISTENITNG OF THE MESSAGE, to the subcription
// As in item-created, we make use of interface Message that describes
// whats inside of msg, what kind of data its there and how we can use it
// our use case is to getData, although we need to specify the type 
    subscription.on('message', (msg: Message) => {
      console.log(`received ${this.subject} from group ${this.queueGroupName}`);
//passing parsedData and wholem message
      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }
// PULLING THE MESSSAGE
// here we are saying what kind of data we really want to take, because
// with the usage of the ? : statement, we are saying that if there gonna be a buffer
// (but there won't) we need to make it a string anyway
  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8'));
  }
}
