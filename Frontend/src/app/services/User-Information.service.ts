import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";

export enum MessageType {
  SUCCESS,
  WARNING,
  ERROR
}

export class UserMessage {
  constructor(
    public type: MessageType,
    public text: string
  ) {}

  public getTypeString(): string {
    switch (this.type){
      case MessageType.SUCCESS:
        return "Success";
      case MessageType.WARNING:
        return "Warning";
      case MessageType.ERROR:
        return "Error";
      default:
        return "";
    }
  }

}

@Injectable()
export class UserInformationService {

  private informationSubject: Subject<UserMessage> = new Subject<UserMessage>();

  private loadingSubject: Subject<boolean> = new Subject<boolean>();

  constructor() { }

  public showInformation(message: UserMessage): void {
    this.informationSubject.next(message);
  }

  public getInformation(): Observable<UserMessage> {
    return this.informationSubject.asObservable();
  }

  public startLoading(): void {
      this.loadingSubject.next(true);
  }

  public stopLoading(): void {
    this.loadingSubject.next(false);
  }

  public getLoadingsSubject(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }


}
