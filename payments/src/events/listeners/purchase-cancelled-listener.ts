import { Message } from 'node-nats-streaming';
import { PurchaseStatus, Subjects, PurchaseCancelledEvent, Listener} from '@secondchances/common';
import { Purchase } from '../../models/purchase';
export class PurchaseCancelledListener extends Listener<PurchaseCancelledEvent>{
    subject: Subjects.PurchaseCancelled = Subjects.PurchaseCancelled;
    queueGroupName = 'payments-service';
    async onMessage(data: PurchaseCancelledEvent['data'], msg: Message){
        const purchase = await Purchase.findOne({
            _id: data.id,
        });
    if(!purchase){
        throw new Error('Nie ma takiego zakupu juz');
    }
    purchase.set({status: PurchaseStatus.Cancelled})
    await purchase.save();    
    msg.ack();    
}
        
    }
