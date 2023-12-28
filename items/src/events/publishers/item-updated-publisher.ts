import { Publisher, Subjects, ItemUpdatedEvent } from '@secondchances/common';
//extends generic class which we will try to emit with publisher
export class ItemUpdatedPublisher extends Publisher<ItemUpdatedEvent>{
    //quick metion that we are using Subject which is datastructure that we made in nats, and we can't change enum.
    // this time for modifiying item
    subject: Subjects.ItemUpdated = Subjects.ItemUpdated;
}
