import { Listener, Subjects, PaymentCreatedEvent, PurchaseStatus} from "@secondchances/common"; 
import { Message } from "node-nats-streaming";
import { Purchase } from "../../models/purchase";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated
    queueGroupName = 'payments-service';
    async onMessage(data: PaymentCreatedEvent['data'], msg: Message){
        const purchase = await Purchase.findById(data.purchaseId);
        if(!purchase){
            throw new Error('Not found, sorry you have to look deeper');
        
        }
        purchase.set({
            status: PurchaseStatus.Completed,
        });
        await purchase.save();
        msg.ack();
    }
        
    }
