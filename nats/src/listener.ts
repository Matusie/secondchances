import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { ItemCreatedListener } from './events/item-created-listener';

//creating a client
const client = nats.connect('secondchances', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

//watching for the listener to be connected to NATS, connecting
client.on('connect', () => {
  console.log('Listener connected to NATS');
// each time we close connect, we make graceful close, to notify publisher
  client.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });
//we don't need to add all the subscription options and shit, its all already declared within client
  new ItemCreatedListener(client).listen();
});
//signals sent whenever node tries to restart program
//so before leaving, we need to let know gracefully that its closed
process.on('signalTerminate', () => client.close());
process.on('signalInterupt', () => client.close());