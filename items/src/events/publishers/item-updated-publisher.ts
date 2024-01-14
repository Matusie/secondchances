import { Publisher, Subjects, ItemUpdatedEvent } from '@secondchances/common';
//przedluza klase Publisher ktora jest w common
export class ItemUpdatedPublisher extends Publisher<ItemUpdatedEvent>{
    // nadpisujemy wlasciwosc subject ktorej wartoscia jest enum
    subject: Subjects.ItemUpdated = Subjects.ItemUpdated;
}
