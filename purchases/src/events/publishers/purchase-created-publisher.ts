import { Publisher, PurchaseCreatedEvent, Subjects } from '@secondchances/common';
//extending generic type base class of Publisher where we are sticking the evnet to actually emmit
export class PurchaseCreatedPublisher extends Publisher<PurchaseCreatedEvent>{
    //definig abstract property
    subject: Subjects.PurchaseCreated = Subjects.PurchaseCreated;
}