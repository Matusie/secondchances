// connecting to database and application and now also nat
import { PurchaseCreatedListener } from './events/listeners/purchase-created-listener';
import { natsWrapper } from './nats-wrapper';
import { PurchaseCreatedEvent } from '@secondchances/common';
const start = async () => {
  if (!process.env.NATS_CLUSTER_ID) { //checking if there is valid cluster ID
    throw new Error('Right cluster ID has to be defined');
  }
  if (!process.env.NATS_CLIENT_ID) { //checking if there is valid client ID
    throw new Error('valid client id must be defined');
  }
  if (!process.env.NATS_URL) { //checking if there is valid nats URL
    throw new Error('valid NATS url connection must be defined');
  }

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
new PurchaseCreatedListener(natsWrapper.client).listen();  
}catch(err){console.error(err);}
};
start();