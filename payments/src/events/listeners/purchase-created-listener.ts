import { Message } from "node-nats-streaming";
import { Listener, PurchaseCreatedEvent, Subjects } from '@secondchances/common';
import { Purchase } from "../../models/purchase";

export class PurchaseCreatedListener extends Listener<PurchaseCreatedEvent>{
    subject: Subjects.PurchaseCreated = Subjects.PurchaseCreated; 
    queueGroupName = 'payments-service';
    async onMessage(data: PurchaseCreatedEvent['data'], msg: Message){
        const purchase = Purchase.build({
            id: data.id,
            price: data.item.price,
            status: data.status,
            userId: data.userId,
        });
        await purchase.save();
        msg.ack();
    }

    }
