import {Component, OnInit, Input, EventEmitter, SimpleChanges} from '@angular/core';
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

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if(changes["slot"]){
      this.iconStyle = "fa fa-" + this.slot.icon;
      console.log(this.slot);
    }
  }

  ngOnInit(): void {
  }

  private selected(event): void {
   // this.slot.onSelected.next(this.slot);
    event.stopPropagation();

    this.slot.selectSlot();
/*
    // TODO: in slot.ts?
    if(this.slot.subSlots && !this.slot.showAsOptions){
      this.slot.collapsed = !this.slot.collapsed;
    }*/
  }

  private optionsSelected(event): void {
    this.slot.collapsed = !this.slot.collapsed;
    event.stopPropagation();
  }

  private hover(slot: Slot){
    if(this.slot.onHover){
      this.slot.onHover.next(this.slot);
    }
  }

}
