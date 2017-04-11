import {Component, OnInit, Input, EventEmitter, SimpleChanges, Output} from '@angular/core';
import {Slot} from "../models/slot";


@Component({
  selector: 'menu-slot',
  templateUrl: './menu-slot.component.html',
  styleUrls: ['./menu-slot.component.css']
})
export class MenuSlotComponent implements OnInit {

  @Input("Slot")
  slot: Slot;

  private iconStyle = "fa fa-book";

  private subscriptions = [];

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if(changes["slot"]){
      this.iconStyle = "fa fa-" + this.slot.icon;
      if(!this.slot.subSlots){
        return;
      }

      // TODO: This is not workin
      // Have to set .activeSlot in MenuContainer
      /*
      for(let subscrip of this.subscriptions){
        subscrip.unsubscribe();
      }

      this.subscriptions = [];

      for(let subSlot of this.slot.subSlots) {
        let sub = subSlot.onSelected.subscribe((slot) => {
            console.log("Subslot selected", slot);

            // TODO: Deactivate all other subslots
            for(let toDeActivate of this.slot.subSlots) {
               toDeActivate.active = false;
            }
        });
        this.subscriptions.push(sub);
      }*/
    }
  }

  ngOnInit(): void {
  }

  private selected(event): void {
    event.stopPropagation();
    this.slot.selectSlot();
  }

  private optionsSelected(event): void {
    this.slot.showOptions();
    event.stopPropagation();
  }

}
