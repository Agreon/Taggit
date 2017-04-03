import {Injectable, HostListener} from '@angular/core';
import {InputReceiver} from "../models/input-receiver";

@Injectable()
export class InputService {

  private receivers = {};

  constructor() { }

  public addReciever(name: string, receiver: InputReceiver){
    this.receivers[name] = { receiver: receiver, active: false };
  }

  public setActive(name: string){
    for(let r in this.receivers){
      this.receivers[r].active = false;
    }
    this.receivers[name].active = true;
  }

  public keyPress(event: KeyboardEvent){
    for(let r in this.receivers){
      if(this.receivers[r].active){
        this.receivers[r].receiver.keyEvent(event);
      }
    }
  }

}
