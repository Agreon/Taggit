import {EventEmitter} from "@angular/core";
import {Subject} from "rxjs";

export class Slot {


  constructor(
    public name: string,
    public selected: Subject<any>,
    public options?: Slot[],
    public active: boolean = false,
    public collapsed: boolean = true) {
  }
}
