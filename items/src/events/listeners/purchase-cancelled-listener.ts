import { Subjects, Listener, PurchaseCancelledEvent} from '@secondchances/common';
import { Item } from '../../models/item';
import { Message } from 'node-nats-streaming';
import { ItemUpdatedPublisher } from '../publishers/item-updated-publisher';
export class PurchaseCancelledListener extends Listener<PurchaseCancelledEvent>{
    subject: Subjects.PurchaseCancelled = Subjects.PurchaseCancelled;
    queueGroupName = 'purchases-service'; //grupa do ktorej nalezy listener
    async onMessage(data: PurchaseCancelledEvent['data'], msg: Message){
        const item = await Item.findById(data.item.id);
        if(!item){ //sprawdzenie czy przedmiot istnieje
            throw new Error('Nie ma takiego przedmiotu');
        } //zmiana statusu zamowienia
        item.set({purchaseId: undefined });
        await item.save(); // oczekiwanie na otrzymanie zamowienia
        await new ItemUpdatedPublisher(this.client).publish({
            id: item.id,
            description: item.description ?? '', 
            avatar: item.avatar ?? '', 
            userId: item.userId,
            price: item.price,
            title: item.title,
        });
    }
}