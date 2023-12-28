// connecting to database and application and now also nats
import mongoose from 'mongoose';
import {app} from './app'; 
import { natsWrapper } from './nats-wrapper';
import { ItemCreatedListener } from './events/listeners/item-created-listener';
import { ItemUpdatedListener } from './events/listeners/item-updated-listener';
import { TimerCompletedListener } from './events/listeners/timer-completed-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';
const start = async () => {
  console.log('Co za franca');
  if (!process.env.jwt_key) { //checking if you have cookie
    throw new Error('jwt_key must be defined');
  }
  if (!process.env.DB_URI) { //checking if there is database connection
    throw new Error('DB_URI must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) { //checking if there is valid cluster ID
    throw new Error('Right cluster ID has to be defined');
  }
  if (!process.env.NATS_CLIENT_ID) { //checking if there is valid client ID
    throw new Error('valid client id must be defined');
  }
  if (!process.env.NATS_URL) { //checking if there is valid nats URL
    throw new Error('valid NATS url connection must be defined');
  }
// connecting to mongodb through mongoose
//connecting to nats, we have given informations about connection in the deployment
  try {
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL)
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });
   //signals sent whenever node tries to restart program
//so before leaving, we need to let know gracefully that its closed
process.on('signalTerminate', () => natsWrapper.client.close());
process.on('signalInterupt', () => natsWrapper.client.close());
//wiring up listener events
new PaymentCreatedListener(natsWrapper.client).listen();
new ItemCreatedListener(natsWrapper.client).listen();
new ItemUpdatedListener(natsWrapper.client).listen();
new TimerCompletedListener(natsWrapper.client).listen();
// passing connection settings
    await mongoose.connect(process.env.DB_URI);

    console.log('Connected to MongoDb');
  } catch (err) {
    console.error(err);
  }
//starting to listen to application, starting express app
  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!!!!');
  });
};
// connecting to NATS is much different, 
// we need to have client being able to be shared through out all the files
// unlike mongoose that has the information already inside
// thats why its in client.ts not here, as everything else
// here we will have just code to initalize it
start();

