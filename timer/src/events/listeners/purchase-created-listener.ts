import { Listener, Subjects, PurchaseCreatedEvent } from "@secondchances/common";
import { Message } from "node-nats-streaming";
import { timerQueue } from "../../queues/timer-queue";
export class PurchaseCreatedListener extends Listener<PurchaseCreatedEvent>{
    subject: Subjects.PurchaseCreated = Subjects.PurchaseCreated;
    queueGroupName = 'timer-service';
    async onMessage(data: PurchaseCreatedEvent['data'], msg: Message) {
        const delay = new Date(data.expiresAt).getTime()-new Date().getTime();
        console.log('Masz tyle milisekund skurwysynie, predko', delay);
        //providing a job and queueing it up
        await timerQueue.add(
            {
            purchaseId: data.id,
            },
        
            {
            delay,
            }
            );
        msg.ack();
    }
}