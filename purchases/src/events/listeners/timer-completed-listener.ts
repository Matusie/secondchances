import { Message } from "node-nats-streaming";
import { Listener, TimerCompletedEvent, Subjects, PurchaseStatus } from "@secondchances/common";
import { Purchase } from "../../models/purchase";
import { PurchaseCancelledPublisher } from "../publishers/purchase-cancelled-publisher";
export class TimerCompletedListener extends Listener<TimerCompletedEvent>{
    queueGroupName = 'purchase-service';
    subject: Subjects.TimerCompleted = Subjects.TimerCompleted;
    async onMessage(data:TimerCompletedEvent['data'],msg: Message) {
        const purchase = await Purchase.findById(data.purchaseId).populate('item');
        if(!purchase){
            throw new Error('Nie ma takie purchase')
        }
        if(purchase.status === PurchaseStatus.Completed){
            return msg.ack();
        }
        purchase.set({
            status: PurchaseStatus.Cancelled,
        });
        await purchase.save();

        //informing everyone its getting cancelled
        await new PurchaseCancelledPublisher(this.client).publish({
            id: purchase.id,
            item: {
                id: purchase.item.id
            }
        });
        msg.ack();
    }
   
}