import {Subject} from "rxjs";

export class Slot {
  constructor(
    public name: string,
    public icon: string = "",
    public subSlots?: Slot[],
    public showAsOptions: boolean = false,
    public onSelected: Subject<any> = new Subject(),
    public onHover: Subject<any> = new Subject(),
    public active: boolean = false,
    public collapsed: boolean = true) {
  }
}
