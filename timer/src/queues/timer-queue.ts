import Queue from 'bull';
import {TimerCompletedPublisher} from '../events/publishers/timer-completed-publisher';
import { natsWrapper } from '../nats-wrapper';
//stworzenie interfejsu
interface Data {
    purchaseId: string;
}
//stworzenie kolejki
const timerQueue = new Queue<Data>('purchase:timer',{
    redis: {
        host: process.env.REDIS_HOST
    }
});
//stworzenie procesu pracujacego na kolejce z NATS
timerQueue.process(async (job)=>{
    new TimerCompletedPublisher(natsWrapper.client).publish({
        purchaseId: job.data.purchaseId,
    })

});
export { timerQueue };