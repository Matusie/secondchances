import { Subjects, Publisher, TimerCompletedEvent } from "@secondchances/common";

export class TimerCompletedPublisher extends Publisher<TimerCompletedEvent>{
    subject: Subjects.TimerCompleted = Subjects.TimerCompleted;
}