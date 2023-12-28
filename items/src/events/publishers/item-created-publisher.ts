import { Publisher, Subjects, ItemCreatedEvent } from '@secondchances/common';
//extends generic class which we will try to emit with publisher
export class ItemCreatedPublisher extends Publisher<ItemCreatedEvent>{
    //quick metion that we are using Subject which is datastructure that we made in nats, and we can't change enum.
    subject: Subjects.ItemCreated = Subjects.ItemCreated;
}

