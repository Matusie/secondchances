import { Subjects } from './subjects';
//matching structure of the data with the structure of the message

export interface ItemCreatedEvent {
  subject: Subjects.ItemCreated; //saying that if the event that was specifieid in enum will be created, then
  data: { //its data gonna look like this
    id: string;
    title: string;
    price: number;
  };
}
