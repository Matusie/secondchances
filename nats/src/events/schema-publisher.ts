//checking data structure and correctness, same as in listener
import { Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';
//adding that it should follow Subjects that are types of events defined in enums
interface Event {
  subject: Subjects;
  data: any;
}
//again generic class T, again extending that shit, using T to extend subject
export abstract class Publisher<T extends Event> {
  abstract subject: T['subject'];
  client: Stan;
//copy that it is initialized
  constructor(client: Stan) {
    this.client = client;
  }
//taking data and publishing it into the NATS server
//again T data, Promise used because of asyc await syntax in publisher.ts
// promise resolves, if the callback function is used and if it is used with the error
  publish(data: T['data']): Promise<void> { //we said void, because we actullay do not resolve with anything
    return new Promise((resolve, reject) => { //we can resolve and reject, there is no resolving but rejecting with throwing out error
      //saying what data we want to publish, simple errorhandler and changing it to JSON, because it has to be a string
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          return reject(err);
        }
        console.log('Event published to subject', this.subject);
        resolve();
      });
    });
  }
}
