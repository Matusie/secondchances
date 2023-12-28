import nats from 'node-nats-streaming';
import { ItemCreatedPublisher } from './events/item-created-publisher';

//creating a client
const client = nats.connect('secondchances', 'publisherID', { //connection declared in deployment
  url: 'http://localhost:4222', //port declared in deployment
});
// listening for the connection event
client.on('connect', async () => {
  console.log('Connected to the NATS');
//actually publishing, based on data structure, that it has to be id, title and price, because struture says so
  const publisher = new ItemCreatedPublisher(client);
  try {
    //its useful to actually WAIT until the event is published
    await publisher.publish({
      id: '2137',
      title: 'zolta',
      price: 30,
    });
  } catch (err) {
    console.error(err);
  }
});
