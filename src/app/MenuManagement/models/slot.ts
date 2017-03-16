import {Subject} from "rxjs";

export class Slot {
  constructor(
    public name: string,
    public selected: Subject<any>,
    public icon: string,
    public options?: Slot[],
    public active: boolean = false,
    public collapsed: boolean = true) {
  }
}
