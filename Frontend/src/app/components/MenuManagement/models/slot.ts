import {Subject} from "rxjs";
import {forEach} from "@angular/router/src/utils/collection";

export class Slot {

  private subSlotIndex: number = 0;
  public onHover: Subject<any> = new Subject();
  public hovered: boolean = false;

  constructor(
    public name: string,
    public icon: string = "",
    public subSlots?: Slot[],
    public showAsOptions: boolean = false,
    public onSelected: Subject<any> = new Subject(),
    public active: boolean = false,
    public collapsed: boolean = true,
    public eventPayload?: any) {
  }

  public nextSubSlot(){
    // If Subslot is expanded
    if(!this.collapsed && !this.subSlots[this.subSlotIndex].collapsed){
        this.subSlots[this.subSlotIndex].nextSubSlot();
    }
    else if(!this.collapsed && this.subSlotIndex < this.subSlots.length - 1){
      this.subSlotIndex++;
      this.setActive(this.subSlots[this.subSlotIndex]);
    }
  }

  public previousSubSlot(){
    // If Subslot is expanded
    if(!this.collapsed && !this.subSlots[this.subSlotIndex].collapsed){
      this.subSlots[this.subSlotIndex].previousSubSlot();
    }
    else if(!this.collapsed && this.subSlotIndex > 0){
      this.subSlotIndex--;
      this.setActive(this.subSlots[this.subSlotIndex]);
    }
  }


  public selectSlot() {
    // Open
    if (!this.collapsed) {
      this.subSlots[this.subSlotIndex].selectSlot();
      // Closed
    } else {
      // Send Select-Event
      if(this.eventPayload){
        this.onSelected.next(this.eventPayload);
      } else {
        this.onSelected.next(this.name);
      }
      if (this.subSlots && this.showAsOptions == false) {
        this.collapsed = false;
        // Select first SubSlot
        this.subSlotIndex = 0;
        this.setActive(this.subSlots[this.subSlotIndex]);
      }
    }
  }

  public showOptions() {

    // If subslots active
    if(!this.collapsed){
      if(!this.subSlots[this.subSlotIndex].showAsOptions){
        this.collapsed = true;
        this.subSlotIndex = 0;
      }else {
        this.subSlots[this.subSlotIndex].showOptions();
      }
      return;
    }

    // If options are available
    if(this.showAsOptions){
      this.collapsed = false;
      this.subSlotIndex = 0;
      this.setActive(this.subSlots[this.subSlotIndex]);
    }
  }

  public closeSlot() {
    if(!this.collapsed){
      if(!this.subSlots[this.subSlotIndex].collapsed){
        this.subSlots[this.subSlotIndex].closeSlot();
      } else {
        this.collapsed = true;
        this.subSlotIndex = 0;
      }
    }
  }

  private setActive(slot: Slot){
    for(let currSlot of this.subSlots){
      currSlot.active = currSlot.name == slot.name;
    }
  }


}
