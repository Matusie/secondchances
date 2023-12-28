import { Publisher, PurchaseCancelledEvent, Subjects } from '@secondchances/common';
//extending generic type base class of Publisher where we are sticking the evnet to actually emmit
export class PurchaseCancelledPublisher extends Publisher<PurchaseCancelledEvent>{
    //definig abstract property
    subject: Subjects.PurchaseCancelled = Subjects.PurchaseCancelled;
}