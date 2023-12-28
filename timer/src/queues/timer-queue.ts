import Queue from 'bull';
import {TimerCompletedPublisher} from '../events/publishers/timer-completed-publisher';
import { natsWrapper } from '../nats-wrapper';
//creating the interface how the msg gonna look like
interface Data {
    purchaseId: string;
}
//creating queue that will stack the data
const timerQueue = new Queue<Data>('purchase:timer',{
    redis: {
        host: process.env.REDIS_HOST
    }
});
//creating job which means WRAPPING data (day it was creating, by who)
timerQueue.process(async (job)=>{
    new TimerCompletedPublisher(natsWrapper.client).publish({
        purchaseId: job.data.purchaseId,
    })

});
export { timerQueue };