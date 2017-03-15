import {EventEmitter} from "@angular/core";
export class Slot {
  constructor(
    public name: string,
    public event: EventEmitter,
    public active: boolean = false,
    public options?: Array<Slot>) {
  }
}
